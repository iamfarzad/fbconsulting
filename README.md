# FB Consulting AI Assistant

## Project Info
**URL**: [Project URL](https://lovable.dev/projects/2f9b3b4a-cce5-4f23-8845-9ac62943cb08)

## AI Integration
This project showcases advanced AI capabilities using Google's Generative AI (Gemini) to create an intelligent and engaging consulting assistant. The integration includes:

### Chat Features
- **Google Generative AI (Gemini)**: Leverages state-of-the-art language models for natural conversations
- **Unified Chat Architecture**: A streamlined chat system for seamless interaction
- **Persona Management**: Dynamic AI personas that adapt based on context
- **Lead Capture**: Intelligent extraction of lead information from conversations

### Voice Features
- **Gemini Multimodal Live API**: Real-time voice synthesis for a more natural interaction
- **Charon Voice Model**: Professional and engaging voice for responses
- **Serverless Architecture**: Efficient voice processing using Vercel serverless functions
- **WebAudio Integration**: High-quality audio playback in the browser

### Technical Stack
- **Frontend**: React + TypeScript with modern web audio capabilities
- **Backend**: Vercel serverless functions with Python for voice processing
- **API**: RESTful endpoints for chat and voice synthesis
- **Deployment**: Automated deployment through Vercel's platform

## How to Edit Code
You have several options to edit your application:
- **Use Lovable**: Visit the [Lovable Project](https://lovable.dev/projects/2f9b3b4a-cce5-4f23-8845-9ac62943cb08) and start prompting. Changes will be auto-committed.
- **Local IDE**: Clone the repo and push local changes.
  - ```sh
        git clone <YOUR_GIT_URL>
        cd <YOUR_PROJECT_NAME>
        npm install
        npm run dev
        ```
- **GitHub Web Editor**: Navigate to a file, click 'Edit', make changes, and commit.
- **GitHub Codespaces**: Launch a new Codespace from the main repo page and edit directly.

## Technologies Used
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment
The project is deployed on **Vercel** at [www.farzadbayat.com](https://www.farzadbayat.com).

## Installation

Install all Python dependencies:

```bash
pip install -r requirements.txt
```

For individual services, their requirements.txt files will automatically include the base requirements.

## How to Merge Branches

To merge all the changes in the different branches, you can follow these steps:

1. Ensure you have the latest changes from all branches by pulling the latest updates.
2. Switch to the branch you want to merge into (usually the main branch).
3. Use the `git merge` command to merge each branch into the main branch one by one.
4. Resolve any conflicts that arise during the merge process.
5. Commit the merged changes.
6. Push the updated main branch to the remote repository.

### Steps for Resolving Conflicts

1. When a conflict occurs, Git will mark the conflicted areas in the affected files.
2. Open the conflicted files and look for the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
3. Decide if you want to keep the changes from the current branch, the changes from the branch being merged, or a combination of both.
4. Edit the file to remove the conflict markers and make the necessary changes.
5. After resolving all conflicts, add the resolved files to the staging area using `git add`.
6. Commit the changes with a message indicating that conflicts have been resolved.
7. Continue with the merge process.

## Documentation Updates

The documentation has been updated to reflect the latest changes, including the new section on how to merge branches and resolve conflicts.

## Branch Management

### Default Branch
- **main**: Last updated on Mar 23, 2025.

### Active Branches
1. **fix-vercel-deployment**: Last updated on Mar 23, 2025.
2. **fix-api-key-issues**: Last updated on Mar 22, 2025.
3. **fix-deployment**: Last updated on Mar 22, 2025.
4. **merge-branches-2**: Last updated on Mar 22, 2025.
5. **fix-technical-level-types**: Last updated on Mar 22, 2025.

### Merge Status

To determine if these branches have been merged into main, you can use the following Git commands:

1. List Merged Branches:
   ```sh
   git branch --merged main
   ```

   This command lists all branches that have been merged into main. If a branch appears in this list, it has been successfully merged.

2. List Unmerged Branches:
   ```sh
   git branch --no-merged main
   ```

   This command lists branches that have not been merged into main.

### Recommendations
- **Delete Merged Branches**: After confirming that a branch has been merged into main, you can safely delete it to keep your repository clean:
  ```sh
  git branch -d branch_name
  ```
  Replace `branch_name` with the actual branch name.
- **Review Unmerged Branches**: For branches that haven’t been merged, assess their relevance. If they’re outdated or no longer needed, consider deleting them. If they contain necessary changes, plan to merge them appropriately.

Regularly managing your branches ensures a streamlined and organized repository.

## New API Endpoints

### Text API
- **Endpoint**: `/api/ask`
- **Method**: `POST`
- **Description**: Generates text response using Google's Generative AI (Gemini).
- **Request Body**:
  ```json
  {
    "prompt": "Your text prompt here",
    "persona": "Optional persona"
  }
  ```
- **Response**:
  ```json
  {
    "text": "Generated text response"
  }
  ```

### Audio API
- **Endpoint**: `/api/audio`
- **Method**: `POST`
- **Description**: Generates audio from text using Google's Generative AI (Gemini).
- **Request Body**:
  ```json
  {
    "text": "Your text here",
    "voiceId": "Optional voice ID",
    "languageCode": "Optional language code"
  }
  ```
- **Response**: Audio stream

### Streaming API
- **Endpoint**: `/api/stream`
- **Method**: `GET`
- **Description**: Streams text responses using Server-Sent Events (SSE) or WebSockets.
- **Response**: Streamed text responses

### Document Upload API
- **Endpoint**: `/api/upload/documents`
- **Method**: `POST`
- **Description**: Uploads and processes documents (PDF, DOCX, TXT) to extract text content.
- **Request Body**: Form data with file uploads
- **Response**:
  ```json
  {
    "success": true,
    "documents": [
      {
        "filename": "example.pdf",
        "mimeType": "application/pdf",
        "text": "Extracted text content",
        "size": 12345
      }
    ]
  }
  ```

### Image Upload API
- **Endpoint**: `/api/upload/images`
- **Method**: `POST`
- **Description**: Uploads and processes images to return base64 encoded images with mime types.
- **Request Body**: Form data with file uploads
- **Response**:
  ```json
  {
    "success": true,
    "images": [
      {
        "filename": "example.jpg",
        "mimeType": "image/jpeg",
        "data": "base64 encoded image data",
        "size": 12345
      }
    ]
  }
  ```

### Proposals API
- **Endpoint**: `/api/proposals/send`
- **Method**: `POST`
- **Description**: Sends proposals using nodemailer, Resend, or SendGrid.
- **Request Body**:
  ```json
  {
    "proposalData": "Your proposal data here"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Proposal sent successfully"
  }
  ```

## Secure Key Management

To ensure secure key management, follow these steps:

1. **Environment Variables**: Store sensitive keys and credentials in environment variables. This prevents them from being hardcoded in the source code.
2. **Secret Managers**: Use secret management tools like Google Secret Manager or Vercel Environment Variables to securely store and access keys.
3. **Configuration**: Update your configuration files to use environment variables for sensitive information.

Example of using environment variables in a configuration file:

```javascript
const apiKey = process.env.GOOGLE_API_KEY;
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};
```

By following these practices, you can enhance the security of your application and protect sensitive information from being exposed.
