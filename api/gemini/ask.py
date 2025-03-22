import google.generativeai as genai
import os
from http.server import BaseHTTPRequestHandler
import json

genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

def generate_response(prompt):
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        
        response_text = generate_response(data.get("prompt", "Hello!"))
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"text": response_text}).encode())
