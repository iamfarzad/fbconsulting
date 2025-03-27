export const successResponse = {
  candidates: [
    {
      content: {
        parts: [{ text: "Test successful response" }]
      }
    }
  ]
};

export const streamResponse = {
  stream: true,
  chunks: [
    { text: "Part 1" },
    { text: "Part 2" },
    { text: "Part 3" }
  ]
};

export const errorResponse = {
  error: {
    message: "Test error message",
    code: "TEST_ERROR"
  }
};

export const invalidResponse = {
  candidates: []
};
