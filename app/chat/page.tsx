"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Globe, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { processTamboMessage, renderTamboComponent, TamboMessage } from "@/lib/tambo";

export default function ChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<TamboMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [tripDetails, setTripDetails] = useState<any>(null);
    const [hasInitialized, setHasInitialized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load trip details and auto-generate itinerary
    useEffect(() => {
        if (hasInitialized) return;

        const storedData = sessionStorage.getItem("tripDetails");
        if (storedData) {
            const data = JSON.parse(storedData);
            setTripDetails(data);
            setHasInitialized(true);

            const welcomeMessage = `I want to visit ${data.destination} for ${data.days} days with a budget of $${data.budget}`;

            setMessages([
                {
                    role: "assistant",
                    content: `✈️ Welcome! I'm creating your ${data.days}-day ${data.destination} itinerary with a $${data.budget} budget...`,
                    components: [],
                },
            ]);

            handleAutoGenerate(welcomeMessage);
        } else {
            router.push("/");
        }
    }, [hasInitialized]);

    const handleAutoGenerate = async (message: string) => {
        setIsLoading(true);

        try {
            const response = await processTamboMessage(message, []);

            const assistantMessage: TamboMessage = {
                role: "assistant",
                content: response.message,
                components: response.components,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, I had trouble creating your itinerary. Please try asking me a question!",
                    components: [],
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setIsLoading(true);

        const newUserMessage: TamboMessage = {
            role: "user",
            content: userMessage,
        };
        setMessages((prev) => [...prev, newUserMessage]);

        try {
            const response = await processTamboMessage(userMessage, messages);

            const assistantMessage: TamboMessage = {
                role: "assistant",
                content: response.message,
                components: response.components,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error processing message:", error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, I encountered an error. Please try again!",
                    components: [],
                },
            ]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex flex-col">
            {/* Header - Mobile Optimized */}
            <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg sticky top-0 z-50 safe-area-inset-top">
                <div className="max-w-5xl mx-auto px-3 md:px-4 py-3 md:py-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                        <button
                            onClick={() => router.push("/")}
                            className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 md:p-2 rounded-xl flex-shrink-0">
                            <Globe className="w-4 h-4 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-base md:text-xl font-bold text-gray-900 dark:text-white truncate">Travel Genie</h1>
                            {tripDetails && (
                                <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 truncate">
                                    {tripDetails.destination} • {tripDetails.days}d • ${tripDetails.budget}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
                        <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden md:inline">Tambo AI</span>
                    </div>
                </div>
            </header>

            {/* Chat Container - Mobile Optimized */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto px-3 md:px-4 py-4 md:py-6 pb-24 md:pb-32">
                    <div className="space-y-4 md:space-y-6">
                        <AnimatePresence mode="popLayout">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`${message.role === "user" ? "max-w-[85%]" : "w-full"}`}>
                                        {message.role === "user" ? (
                                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl px-4 py-2.5 md:px-6 md:py-3 shadow-lg">
                                                <p className="text-sm md:text-base break-words">{message.content}</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 md:space-y-4">
                                                {message.content && (
                                                    <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-lg border border-gray-200 dark:border-gray-700">
                                                        <p className="text-sm md:text-base text-gray-900 dark:text-white break-words whitespace-pre-wrap">{message.content}</p>
                                                    </div>
                                                )}

                                                {message.components && message.components.length > 0 && (
                                                    <div className="space-y-3 md:space-y-4">
                                                        {message.components.map((component, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: 0.2 + idx * 0.1 }}
                                                            >
                                                                {renderTamboComponent(component.name, component.props)}
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-lg border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-blue-600" />
                                        <span className="text-sm md:text-base text-gray-600 dark:text-gray-400">Thinking...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </main>

            {/* Input Bar - Mobile Optimized */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 p-3 md:p-4 safe-area-inset-bottom">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    <div className="flex gap-2 md:gap-3 items-end">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base resize-none"
                            disabled={isLoading}
                            style={{ fontSize: '16px' }} /* Prevent iOS zoom */
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-3 md:p-4 hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex-shrink-0"
                            aria-label="Send message"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
