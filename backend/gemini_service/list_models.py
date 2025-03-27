import vertexai
from vertexai.generative_models import GenerationConfig, GenerativeModel

# Different regions to try, including EU and Norway-related regions
regions = [
    "us-central1",      # US, Iowa
    "europe-west1",     # EU, Belgium
    "europe-west2",     # EU, London
    "europe-west3",     # EU, Frankfurt
    "europe-west4",     # EU, Netherlands
    "europe-north1",    # EU, Finland (closest to Norway)
    "europe-west6"      # EU, Zurich
]

print("Checking model availability across regions:")
for region in regions:
    print(f"\n--- Region: {region} ---")
    try:
        # Initialize Vertex AI with specific region
        vertexai.init(
            project="782216609975",
            location=region
        )
        
        # Try to load different model versions to check availability
        models_to_check = [
            # Gemini 1.0 models
            "gemini-1.0-pro",
            "gemini-1.0-pro-vision",
            "gemini-1.0-pro-latest",
            
            # Gemini 1.5 models
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-1.5-pro-001",
            "gemini-1.5-pro-vision",
            "gemini-1.5-pro-vision-latest",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro-latest",
            
            # Gemini 2.0 models (if available)
            "gemini-2.0-pro",
            "gemini-2.0-flash",
            "gemini-2.0-vision",
            
            # Gemini 2.5 models (future)
            "gemini-2.5-pro",
            "gemini-2.5-flash"
        ]

        for model_name in models_to_check:
            try:
                model = GenerativeModel(model_name)
                # Try a simple prompt to verify the model works
                response = model.generate_content("Hi", generation_config=GenerationConfig(max_output_tokens=10))
                print(f"✅ {model_name} - Available")
            except Exception as e:
                error_msg = str(e).split("\n")[0]  # Get just the first line of the error
                print(f"❌ {model_name} - Not available: {error_msg}")
    except Exception as e:
        print(f"❌ Region not supported: {str(e)}")