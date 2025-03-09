
import React, { useRef, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
    ImageIcon,
    FileUp,
    Figma,
    MonitorIcon,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
    Bot,
    MessageSquare,
    Workflow,
    BarChart3,
    Code,
    Eraser,
    Loader2,
} from "lucide-react";
import { useCopilot } from "@/hooks/useCopilot";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AIMessage } from "@/services/copilotService";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/services/analyticsService";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = (reset?: boolean) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        if (reset) {
            textarea.style.height = `${minHeight}px`;
            return;
        }

        // Temporarily shrink to get the right scrollHeight
        textarea.style.height = `${minHeight}px`;

        // Calculate new height
        const newHeight = Math.max(
            minHeight,
            Math.min(
                textarea.scrollHeight,
                maxHeight ?? Number.POSITIVE_INFINITY
            )
        );

        textarea.style.height = `${newHeight}px`;
    };

    useEffect(() => {
        // Set initial height
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    // Adjust height on window resize
    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return { textareaRef, adjustHeight };
}

interface MessageProps {
    message: AIMessage;
    isLastMessage: boolean;
}

const Message = ({ message, isLastMessage }: MessageProps) => {
    const isUser = message.role === 'user';
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "p-3 rounded-lg mb-3 max-w-[80%]",
                isUser 
                    ? "ml-auto bg-teal text-deep-purple" 
                    : "mr-auto bg-deep-purple text-neon-white"
            )}
        >
            <div className="flex items-start gap-2">
                {!isUser && (
                    <div className="p-1.5 bg-deep-purple/50 rounded-full mt-0.5">
                        <Bot size={16} className="text-teal" />
                    </div>
                )}
                <div>
                    <p className={isUser ? "text-deep-purple" : "text-neon-white"}>
                        {message.content}
                    </p>
                    <div className={cn(
                        "text-xs mt-1",
                        isUser ? "text-deep-purple/70" : "text-neon-white/70"
                    )}>
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                    </div>
                </div>
                {isUser && (
                    <div className="p-1.5 bg-teal/30 rounded-full mt-0.5">
                        <CircleUserRound size={16} className="text-deep-purple" />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
    return (
        <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-teal/30 text-teal hover:text-teal transition-colors"
            onClick={onClick}
        >
            {icon}
            <span className="text-xs">{label}</span>
        </Button>
    );
}

export function AIChatInput({ inlineMessages = false, placeholderText = "Ask about AI automation for your business..." }) {
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const { 
        messages, 
        sendMessage, 
        clearMessages, 
        isLoading, 
        leadInfo,
        suggestedResponse,
        currentPersona 
    } = useCopilot();
    
    const [showMessages, setShowMessages] = useState(false);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !isLoading) {
                handleSendMessage();
            }
        }
    };
    
    const handleSendMessage = async () => {
        if (!value.trim() || isLoading) return;
        
        const message = value.trim();
        setValue("");
        adjustHeight(true);
        setShowMessages(true);
        
        await sendMessage(message);
    };
    
    const handleActionClick = (topic: string) => {
        const actionMessages = {
            'Chatbots': "I'm interested in implementing AI chatbots for my business. What options do you offer?",
            'Workflow Automation': "I'd like to automate our workflow processes to save time. How can AI help with that?",
            'AI Strategy': "I need help developing an AI strategy for my business. Where should I start?",
            'Content Generation': "Can you tell me more about AI content generation and how it can help my business?",
            'Data Analysis': "I'm looking to gain better insights from our business data. How can AI analytics help?"
        };
        
        // Track the action click
        trackEvent({
            action: 'action_button_click',
            category: 'chatbot',
            label: topic,
            button_type: 'quick_action'
        });
        
        setValue(actionMessages[topic as keyof typeof actionMessages]);
        adjustHeight();
    };
    
    const handleNavigate = (path: string) => {
        navigate(path);
        
        // Track navigation
        trackEvent({
            action: 'chat_navigation',
            category: 'navigation',
            label: path,
            source: 'chatbot'
        });
    };
    
    // Define the persona-based placeholder texts
    const placeholdersByPersona = {
        strategist: "Ask about AI strategy and transformation...",
        technical: "Ask about technical implementation and integration...",
        consultant: "Ask about specific services and solutions...",
        general: "Ask about AI automation for your business..."
    };

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto">
            {(showMessages || messages.length > 0) && (
                <div className="bg-deep-purple rounded-t-xl border border-teal/30 p-4 overflow-y-auto max-h-[400px] min-h-[200px]">
                    <AnimatePresence>
                        {messages.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-full text-center py-10"
                            >
                                <Bot size={40} className="text-teal mb-4" />
                                <h3 className="text-neon-white text-lg font-medium mb-2">
                                    How can I help with your AI automation needs?
                                </h3>
                                <p className="text-neon-white/70 max-w-lg">
                                    Ask me anything about implementing AI in your business, from chatbots to 
                                    workflow automation and strategic planning.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col space-y-4">
                                {messages.map((msg, index) => (
                                    <Message 
                                        key={index} 
                                        message={msg} 
                                        isLastMessage={index === messages.length - 1}
                                    />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}
            
            <div className={cn(
                "relative bg-deep-purple border border-teal/30",
                (showMessages || messages.length > 0) ? "rounded-b-xl border-t-0" : "rounded-xl"
            )}>
                <div className="overflow-y-auto">
                    <Textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            adjustHeight();
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholdersByPersona[currentPersona] || placeholderText}
                        className={cn(
                            "w-full px-4 py-3",
                            "resize-none",
                            "bg-transparent",
                            "border-none",
                            "text-white text-sm",
                            "focus:outline-none",
                            "focus-visible:ring-0 focus-visible:ring-offset-0",
                            "placeholder:text-neon-white/50 placeholder:text-sm",
                            "min-h-[60px]"
                        )}
                        style={{
                            overflow: "hidden",
                        }}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                        {messages.length > 0 && (
                            <button
                                type="button"
                                className="group p-2 hover:bg-deep-purple/80 rounded-lg transition-colors flex items-center gap-1"
                                onClick={clearMessages}
                                disabled={isLoading}
                            >
                                <Eraser className="w-4 h-4 text-teal" />
                                <span className="text-xs text-teal hidden group-hover:inline transition-opacity">
                                    Clear
                                </span>
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {suggestedResponse && (
                            <button
                                type="button"
                                className="px-2 py-1 rounded-lg text-sm text-teal/80 transition-colors border border-dashed border-teal/30 hover:border-teal/60 hover:bg-deep-purple/80 flex items-center justify-between gap-1"
                                onClick={() => {
                                    setValue(suggestedResponse);
                                    adjustHeight();
                                }}
                                disabled={isLoading}
                            >
                                <PlusIcon className="w-4 h-4" />
                                Suggestion
                            </button>
                        )}
                        <button
                            type="button"
                            className={cn(
                                "px-1.5 py-1.5 rounded-lg text-sm transition-colors border hover:border-teal flex items-center justify-between gap-1",
                                value.trim() && !isLoading
                                    ? "bg-teal text-deep-purple border-teal"
                                    : "text-teal/80 border-teal/30",
                                isLoading && "opacity-50 cursor-not-allowed"
                            )}
                            onClick={handleSendMessage}
                            disabled={!value.trim() || isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <ArrowUpIcon
                                    className={cn(
                                        "w-4 h-4",
                                        value.trim() && !isLoading
                                            ? "text-deep-purple"
                                            : "text-teal/80"
                                    )}
                                />
                            )}
                            <span className="sr-only">Send</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
                <ActionButton
                    icon={<MonitorIcon className="w-4 h-4" />}
                    label="Chatbots"
                    onClick={() => handleActionClick('Chatbots')}
                />
                <ActionButton
                    icon={<Workflow className="w-4 h-4" />}
                    label="Workflow Automation"
                    onClick={() => handleActionClick('Workflow Automation')}
                />
                <ActionButton
                    icon={<Code className="w-4 h-4" />}
                    label="AI Strategy"
                    onClick={() => handleActionClick('AI Strategy')}
                />
                <ActionButton
                    icon={<MessageSquare className="w-4 h-4" />}
                    label="Content Generation"
                    onClick={() => handleActionClick('Content Generation')}
                />
                <ActionButton
                    icon={<BarChart3 className="w-4 h-4" />}
                    label="Data Analysis"
                    onClick={() => handleActionClick('Data Analysis')}
                />
            </div>
            
            {leadInfo.stage === 'ready-to-book' && (
                <div className="mt-4 text-center">
                    <Button 
                        variant="default" 
                        className="rounded-full"
                        onClick={() => handleNavigate('/contact')}
                    >
                        Book a Consultation
                    </Button>
                </div>
            )}
        </div>
    );
}

