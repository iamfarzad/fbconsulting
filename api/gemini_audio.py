import time
from gemini import Client
from flask import jsonify, Response

def handler(request):
    if request.method == 'POST':
        body = request.get_json()
        
        if not body or 'text' not in body:
            return jsonify({
                'error': 'Missing required text in request body'
            }), 400

        client = Client()
        config = {
            "model": {
                "provider": "anthropic",
                "name": "claude-3-opus-20240229",
                "temperature": 0.7,
                "max_tokens": 1000
            }
        }

        # Start live session and send text with timeout and retry logic
        session = None
        start_time = time.time()
        max_retries = 2
        retry_count = 0
        audio_data = None

        while retry_count <= max_retries and time.time() - start_time < 45:  # Overall timeout of 45 seconds
            try:
                session = client.connect("gemini-2.0-flash", config)
                response = session.send({
                    "turns": [{
                        "parts": [{"text": body['text']}],
                        "role": "user"
                    }],
                    "turn_complete": True
                })

                if response and response.get('audio'):
                    audio_data = response['audio']
                    break
                
                retry_count += 1
                time.sleep(1)  # Brief pause between retries
                
            except Exception as e:
                retry_count += 1
                if retry_count > max_retries:
                    return jsonify({
                        'error': f'Failed to generate audio after {max_retries} attempts: {str(e)}'
                    }), 500
                continue

        if not audio_data:
            return jsonify({
                'error': 'Failed to generate audio response'
            }), 500

        # Return audio data as response
        return Response(
            audio_data,
            mimetype='audio/mp3',
            headers={
                'Content-Disposition': 'attachment; filename=response.mp3'
            }
        )

    return jsonify({
        'error': 'Method not allowed'
    }), 405
