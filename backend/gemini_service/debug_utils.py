import time
import wave
import json
import logging
import asyncio
import websockets
from pathlib import Path
from typing import Dict, List, Any
import matplotlib.pyplot as plt
from pydub import AudioSegment
from datetime import datetime

# Remove redundant basicConfig - rely on main.py for setup
# logging.basicConfig(level=logging.INFO) 
logger = logging.getLogger(__name__)

class PerformanceMetrics:
    def __init__(self):
        self.response_times: List[float] = []
        self.audio_sizes: List[int] = []
        self.connection_stats: Dict[str, Any] = {
            "total_connections": 0,
            "failed_connections": 0,
            "avg_response_time": 0
        }
        self.errors: List[str] = []

    def log_response_time(self, time_ms: float):
        self.response_times.append(time_ms)
        
    def log_audio_size(self, size_bytes: int):
        self.audio_sizes.append(size_bytes)

    def log_error(self, error: str):
        self.errors.append(error)

    def generate_report(self) -> Dict[str, Any]:
        if self.response_times:
            avg_response = sum(self.response_times) / len(self.response_times)
            self.connection_stats["avg_response_time"] = avg_response

        return {
            "metrics": {
                "total_messages": len(self.response_times),
                "avg_response_time_ms": self.connection_stats["avg_response_time"],
                "avg_audio_size_kb": sum(self.audio_sizes) / len(self.audio_sizes) / 1024 if self.audio_sizes else 0,
                "error_rate": len(self.errors) / len(self.response_times) if self.response_times else 0
            },
            "errors": self.errors
        }

class AudioAnalyzer:
    def __init__(self, output_dir: Path):
        self.output_dir = output_dir
        self.output_dir.mkdir(exist_ok=True)

    def analyze_audio_file(self, audio_path: Path) -> Dict[str, Any]:
        """Analyze audio file and return metrics"""
        try:
            audio = AudioSegment.from_file(audio_path)
            
            return {
                "duration_ms": len(audio),
                "channels": audio.channels,
                "sample_width_bytes": audio.sample_width,
                "frame_rate": audio.frame_rate,
                "size_bytes": len(audio.raw_data)
            }
        except Exception as e:
            logger.error(f"Error analyzing audio file: {e}")
            return {}

    def plot_waveform(self, audio_path: Path, output_path: Path):
        """Generate waveform plot"""
        try:
            audio = AudioSegment.from_file(audio_path)
            samples = audio.get_array_of_samples()
            
            plt.figure(figsize=(15, 5))
            plt.plot(samples)
            plt.title("Audio Waveform")
            plt.xlabel("Sample")
            plt.ylabel("Amplitude")
            plt.savefig(output_path)
            plt.close()
        except Exception as e:
            logger.error(f"Error plotting waveform: {e}")

async def run_performance_test(
    host: str = "localhost",
    port: int = 8000,
    num_messages: int = 5,
    save_audio: bool = True
) -> None:
    """Run performance test and generate report"""
    metrics = PerformanceMetrics()
    output_dir = Path("debug_output")
    output_dir.mkdir(exist_ok=True)
    
    audio_analyzer = AudioAnalyzer(output_dir)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    test_messages = [
        "Tell me a short joke",
        "What's the weather like?",
        "How does text-to-speech work?",
        "Can you sing a melody?",
        "Tell me about the solar system"
    ]

    try:
        uri = f"ws://{host}:{port}/ws/debug-client"
        async with websockets.connect(uri) as websocket:
            for i in range(min(num_messages, len(test_messages))):
                message = test_messages[i]
                start_time = time.time()
                
                # Send message
                await websocket.send(json.dumps({
                    "type": "text_message", # Explicitly set type
                    "text": message,
                    "role": "user",
                    "enableTTS": True
                }))

                # Collect response
                audio_chunks = []
                while True:
                    try:
                        response = await websocket.recv()
                        if isinstance(response, str):
                            data = json.loads(response)
                            if data.get("type") == "error":
                                metrics.log_error(data.get("error"))
                            elif data.get("type") == "complete":
                                break
                        elif isinstance(response, bytes):
                            audio_chunks.append(response)
                    except websockets.exceptions.ConnectionClosed:
                        break

                # Log metrics
                end_time = time.time()
                metrics.log_response_time((end_time - start_time) * 1000)
                
                if audio_chunks and save_audio:
                    # Save and analyze audio
                    audio_data = b"".join(audio_chunks)
                    metrics.log_audio_size(len(audio_data))
                    
                    audio_path = output_dir / f"response_{i}_{timestamp}.mp3"
                    audio_path.write_bytes(audio_data)
                    
                    # Analyze audio quality
                    analysis = audio_analyzer.analyze_audio_file(audio_path)
                    waveform_path = output_dir / f"waveform_{i}_{timestamp}.png"
                    audio_analyzer.plot_waveform(audio_path, waveform_path)
                    
                    logger.info(f"Audio analysis for message {i}:")
                    logger.info(json.dumps(analysis, indent=2))

        # Generate final report
        report = metrics.generate_report()
        report_path = output_dir / f"performance_report_{timestamp}.json"
        report_path.write_text(json.dumps(report, indent=2))
        
        logger.info("Performance test complete. Report saved to: %s", report_path)
        logger.info("
Summary:")
        logger.info(json.dumps(report["metrics"], indent=2))

    except Exception as e:
        logger.error(f"Error during performance test: {e}", exc_info=True)

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Run Gemini service performance tests")
    parser.add_argument("--host", default="localhost", help="WebSocket host")
    parser.add_argument("--port", type=int, default=8000, help="WebSocket port")
    parser.add_argument("--messages", type=int, default=5, help="Number of test messages")
    parser.add_argument("--no-audio", action="store_false", dest="save_audio", help="Don't save audio files")
    
    args = parser.parse_args()
    
    # Ensure logging is configured if running standalone
    # Consider adding a simple basicConfig here if running this file directly is common
    # logging.basicConfig(level=logging.INFO) 
    
    asyncio.run(run_performance_test(
        host=args.host,
        port=args.port,
        num_messages=args.messages,
        save_audio=args.save_audio
    ))
