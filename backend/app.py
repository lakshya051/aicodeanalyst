import os
import ast
import shutil
import time
import stat
import requests
import git
import google.generativeai as genai
from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from dotenv import load_dotenv
import chromadb
from langchain.text_splitter import RecursiveCharacterTextSplitter
# This import was missing in some versions
from langchain_community.document_loaders import PyPDFLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import networkx as nx

# --- Boilerplate and Setup ---
load_dotenv()
app = Flask(__name__)
CORS(app)
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
except Exception as e:
    print(f"Error configuring Google AI: {e}")

client = chromadb.Client()
# Renamed collections to be more specific and avoid conflicts
snippet_collection = client.get_or_create_collection(name="snippet_collection")
url_collection = client.get_or_create_collection(name="url_repo_collection")


# --- SNIPPET MODE ENDPOINTS ---
@app.route('/snippet_chat', methods=['POST'])
def snippet_chat_handler():
    try:
        data = request.get_json()
        code = data['code']; history = data['history']
        user_prompt = history[-1]['parts'][0]
        system_instruction = "You are an AI coding mentor. First, provide a detailed review of the code. Then, answer follow-up questions."
        if len(history) == 1:
            full_prompt = f"{system_instruction}\n\nCode to review:\n```\n{code}\n```"
        else:
            full_prompt = f"Remember the code:\n```\n{code}\n```\n\nRespond to my last message: '{user_prompt}'"
        model = genai.GenerativeModel('gemini-1.5-flash')
        chat = model.start_chat(history=history[:-1])
        response = chat.send_message(full_prompt)
        return jsonify({'reply': response.text})
    except Exception as e:
        print(f"Error in snippet_chat: {e}"); return jsonify({'error': str(e)}), 500

@app.route('/snippet_refactor', methods=['POST'])
def snippet_refactor_handler():
    try:
        data = request.get_json(); code = data.get('code')
        if not code: return jsonify({'error': 'Code is required.'}), 400
        prompt = "Refactor the following code to be more readable and efficient. Only return the refactored code inside a single code block."
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt + f"\n\nOriginal code:\n```\n{code}\n```")
        cleaned_code = response.text.strip().replace('```', '').strip()
        return jsonify({'refactored_code': cleaned_code})
    except Exception as e:
        print(f"Error in snippet_refactor: {e}"); return jsonify({'error': 'Refactoring failed.'}), 500

@app.route('/snippet_translate', methods=['POST'])
def snippet_translate_handler():
    try:
        data = request.get_json(); code = data.get('code'); language = data.get('language')
        if not code or not language: return jsonify({'error': 'Code and language are required.'}), 400
        prompt = f"Translate the following code to {language}. Only return the translated code inside a single code block."
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt + f"\n\nOriginal code:\n```\n{code}\n```")
        cleaned_code = response.text.strip().replace('```', '').strip()
        return jsonify({'translated_code': cleaned_code})
    except Exception as e:
        print(f"Error in snippet_translate: {e}"); return jsonify({'error': 'Translation failed.'}), 500

# --- PUBLIC REPO MODE ENDPOINTS ---
@app.route('/analyze-url', methods=['POST'])
def analyze_url():
    data = request.get_json()
    repo_url = data.get('repo_url')
    if not repo_url or "github.com" not in repo_url:
        return jsonify({'error': 'A valid public GitHub repository URL is required.'}), 400

    repo_name = repo_url.split('/')[-1].replace('.git', '')
    clone_path = f"./temp_{repo_name}"

    try:
        if url_collection.count() > 0:
            url_collection.delete(ids=url_collection.get()['ids'])
        if os.path.exists(clone_path):
            shutil.rmtree(clone_path)
            
        print(f"Cloning public repository: {repo_url}...")
        git.Repo.clone_from(repo_url, clone_path)
        print("Cloning complete.")

        all_docs = []
        for root, _, files in os.walk(clone_path):
            for file in files:
                if file.endswith(('.py', '.js', '.jsx', '.ts', '.tsx', '.md', '.html', '.css', 'Dockerfile')):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        from langchain.docstore.document import Document
                        doc = Document(page_content=f"File: {file_path.replace(clone_path, '')}\n\n{content}")
                        all_docs.append(doc)
                    except Exception as e:
                        print(f"Skipping unreadable file: {file_path}")

        if not all_docs:
            return jsonify({'error': 'No readable code files found in the repository.'}), 400

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=300)
        chunks = text_splitter.split_documents(all_docs)
        chunk_texts = [chunk.page_content for chunk in chunks]
        
        print(f"Generating embeddings for {len(chunk_texts)} chunks...")
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        url_collection.add(
            embeddings=embeddings.embed_documents(chunk_texts),
            documents=chunk_texts,
            ids=[f"chunk_{i}" for i in range(len(chunk_texts))]
        )
        print("Indexing complete.")

        return jsonify({'message': f"Repo '{repo_name}' analyzed successfully."})
    except git.exc.GitCommandError as git_error:
        print(f"Git clone error: {git_error}")
        return jsonify({'error': 'Failed to clone repository. Please ensure the URL is correct and the repository is public.'}), 500
    except Exception as e:
        print(f"Error analyzing URL repo: {e}")
        return jsonify({'error': 'An unexpected error occurred during analysis.'}), 500
    finally:
        if os.path.exists(clone_path):
            def remove_readonly(func, path, _):
                os.chmod(path, stat.S_IWRITE)
                func(path)
            shutil.rmtree(clone_path, onerror=remove_readonly)

@app.route('/url_chat', methods=['POST'])
def url_chat_handler():
    data = request.get_json(); question = data.get('question')
    if not question: return jsonify({'error': 'Question is required.'}), 400
    try:
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        results = url_collection.query(
            query_embeddings=embeddings.embed_query(question),
            n_results=5
        )
        relevant_docs = "\n\n".join(results['documents'][0])
        prompt = f"""You are an AI assistant helping a developer understand a full code repository.
        
        Based on the following relevant parts of the codebase, answer the user's question.
        
        **CRITICAL RULE:** When you reference any specific code from the context, you MUST cite its source file. Use the format `[<file_path>]`. For example, `[src/api/auth.js]`. If you reference a specific line, use `[<file_path>:<line_number>]`.
        
        Relevant Code Chunks (context):
        ---
        {relevant_docs}
        ---
        
        User's Question: {question}
        
        Answer with citations:
        """
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        return jsonify({'reply': response.text})
    except Exception as e:
        print(f"Error during URL chat: {e}")
        return jsonify({'error': 'Failed to get a response.'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
