import google.generativeai as genai
import os
from http.server import BaseHTTPRequestHandler
import json
from base64 import b64decode
from urllib.parse import parse_qs
import cors_handler

genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

def process_images(images):
    processed_images = []
    for img in images:
        if img.get('data'):
            image_data = b64decode(img['data'].split(',')[1])
            processed_images.append({
                'mime_type': img['mimeType'],
                'data': image_data
            })
    return processed_images

def generate_response(prompt, images=None, persona=None):
    try:
        if images:
            model = genai.GenerativeModel('gemini-pro-vision')
            processed_images = process_images(images)
            response = model.generate_content([prompt, *processed_images])
        else:
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)
        
        return response.text
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        raise

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        try:
            # Add CORS headers
            self.send_header('Access-Control-Allow-Origin', '*')
            
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            
            prompt = data.get('prompt', '')
            images = data.get('images', [])
            persona = data.get('persona')
            
            response_text = generate_response(prompt, images, persona)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"text": response_text}).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
