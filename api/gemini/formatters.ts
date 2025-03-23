export function formatGeminiResponse(text: string): string {
  return text
    .trim()
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
    .replace(/```/g, '') // Remove code block markers
    .replace(/\*\*/g, ''); // Remove bold markers
}

export function sanitizePrompt(prompt: string): string {
  return prompt
    .trim()
    .replace(/[^\w\s.,?!-]/g, '') // Remove special characters
    .substring(0, 1000); // Limit length
}
