import { useEffect } from "react";
import { registerCopilotTool } from "@copilot-kit/react-core";
import { GeminiAction } from "@/types";
import { useGeminiCopilot } from "@/components/copilot/GeminiCopilotProvider";

// Updated to use the context instead of direct dispatch
export function useCopilotTools() {
  const { setStep, generateProposal, resetConversation } = useGeminiCopilot();

  useEffect(() => {
    // Register the showCTAOptions tool
    const showCTATool = registerCopilotTool({
      name: "showCTAOptions",
      description: "Guide the user to choose between a proposal or a call.",
      parameters: [],
      handler: async () => {
        setStep("chooseAction");
        return "I've shown the user some next steps to pick from.";
      },
    });

    // Register the generateProposal tool
    const proposalTool = registerCopilotTool({
      name: "generateProposal",
      description: "Generate a business proposal based on chat context",
      parameters: {
        type: "object",
        properties: {
          summary: {
            type: "array",
            items: { type: "string" },
            description: "Key points from the conversation",
          },
          pricing: {
            type: "array",
            items: {
              type: "object",
              properties: {
                service: { type: "string" },
                price: { type: "number" },
                description: { type: "string" },
              },
            },
          },
          recommendations: {
            type: "array",
            items: { type: "string" },
            description: "List of recommendations",
          },
        },
        required: ["summary", "pricing", "recommendations"],
      },
      handler: async (params) => {
        await generateProposal({
          summary: params.summary,
          pricing: params.pricing,
          recommendations: params.recommendations,
        });
        setStep("proposal");
        return "I've generated and displayed the proposal for the user.";
      },
    });

    // Register the resetConversation tool
    const resetTool = registerCopilotTool({
      name: "resetConversation",
      description: "Reset the conversation and start over",
      parameters: [],
      handler: async () => {
        resetConversation();
        return { success: true, message: "Conversation has been reset" };
      },
    });

    // Cleanup on unmount
    return () => {
      showCTATool.unregister();
      proposalTool.unregister();
      resetTool.unregister();
    };
  }, [setStep, generateProposal, resetConversation]);
}
