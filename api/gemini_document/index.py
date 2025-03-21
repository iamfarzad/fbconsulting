from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import PyPDF2
import docx
import io
import base64
import os

app = FastAPI()

async def process_pdf(file: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_file = io.BytesIO(file)
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing PDF: {str(e)}")

async def process_docx(file: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc = docx.Document(io.BytesIO(file))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing DOCX: {str(e)}")

async def process_txt(file: bytes) -> str:
    """Process text file"""
    try:
        text = file.decode('utf-8')
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing TXT: {str(e)}")

@app.post("/api/gemini_document")
async def upload_documents(files: List[UploadFile] = File(...)) -> JSONResponse:
    """
    Handle document uploads for Gemini chat.
    Supports PDF, DOCX, and TXT files.
    Returns extracted text content.
    """
    try:
        processed_documents = []
        
        for file in files:
            content = await file.read()
            mime_type = file.content_type

            # Extract text based on file type
            if file.filename.lower().endswith('.pdf'):
                text = await process_pdf(content)
            elif file.filename.lower().endswith('.docx'):
                text = await process_docx(content)
            elif file.filename.lower().endswith('.txt'):
                text = await process_txt(content)
            else:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Unsupported file type: {file.filename}"
                )

            # Create document metadata
            document_info = {
                'filename': file.filename,
                'mimeType': mime_type,
                'text': text,
                'size': len(content)
            }
            
            processed_documents.append(document_info)
            
        return JSONResponse({
            'success': True,
            'documents': processed_documents
        })
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                'success': False,
                'error': str(e)
            }
        )
