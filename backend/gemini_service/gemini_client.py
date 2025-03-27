from vertexai.generative_models import GenerativeModel
import vertexai

# Initialize Vertex AI with your project ID
vertexai.init(
    project="782216609975",
    location="us-central1"  # Required for Gemini
)

# Load Gemini model
model = GenerativeModel("gemini-1.5-pro-001")  # Update to "gemini-2.5-pro" when available

# Prompt
response = model.generate_content("Explain how AI works")

# Print result
print(response.text)

