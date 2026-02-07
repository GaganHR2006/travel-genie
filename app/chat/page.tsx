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
    const [theme, setTheme] = useState<any>(null);
    const [hasInitialized, setHasInitialized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (hasInitialized) return;

        const storedData = sessionStorage.getItem("tripDetails");
        if (storedData) {
            const data = JSON.parse(storedData);
            setTripDetails(data);
            setTheme(data.theme);
            setHasInitialized(true);

            const welcomeMessage = `I want to visit ${data.destination} for ${data.days} days with a budget of ${data.budget}`;

            setMessages([
                {
                    role: "assistant",
                    content: `✈️ Welcome! Creating your ${data.days}-day ${data.destination} itinerary...`,
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
            console.error("Error:", error);
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

    const particleColor = theme?.particleColor || "#6366f1";

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Dynamic Background */}
            {/* Dynamic Background */}
            {theme?.backgroundImage && (
                <>
                    <div
                        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url('${theme.backgroundImage}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <div
                        className={`fixed inset-0 bg-gradient-to-br ${theme.gradient || 'from-indigo-600/80 via-purple-600/80 to-pink-600/80'}`}
                        style={{ mixBlendMode: 'multiply' }}
                    />
                </>
            )}

            {/* Animated Particles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${Math.random() * 3 + 2}px`,
                            height: `${Math.random() * 3 + 2}px`,
                            backgroundColor: particleColor,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.2, 0.6, 0.2],
                            y: [0, -20, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <header className="relative z-50 border-b border-white/20 bg-white/10 backdrop-blur-xl sticky top-0 safe-area-inset-top">
                <div className="max-w-5xl mx-auto px-3 md:px-4 py-3 md:py-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                        <button
                            onClick={() => router.push("/")}
                            className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </button>
                        <div className="bg-white/20 backdrop-blur-sm p-1.5 md:p-2 rounded-xl flex-shrink-0">
                            <Globe className="w-4 h-4 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-base md:text-xl font-bold text-white truncate">Travel Genie</h1>
                            {tripDetails && (
                                <p className="text-[10px] md:text-xs text-white/70 truncate">
                                    {tripDetails.destination} • {tripDetails.days}d • ₹{tripDetails.budget}
                                </p>
                            )}
                        </div>
                    </div>
                    {theme && (
                        <div className="flex items-center gap-2 text-white/80 flex-shrink-0">
                            <span className="text-xl">{theme.emojis[0]}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Chat Messages */}
            <main className="flex-1 overflow-y-auto relative z-10">
                <div className="max-w-5xl mx-auto px-3 md:px-4 py-4 md:py-6 pb-24 md:pb-32">
                    <div className="space-y-4 md:space-y-6">
                        <AnimatePresence mode="popLayout">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`${message.role === "user" ? "max-w-[85%]" : "w-full"}`}>
                                        {message.role === "user" ? (
                                            <div
                                                className="rounded-2xl px-4 py-2.5 md:px-6 md:py-3 shadow-lg text-white"
                                                style={{
                                                    background: theme
                                                        ? `linear-gradient(to right, ${theme.primaryColor}, ${theme.accentColor})`
                                                        : 'linear-gradient(to right, #6366f1, #a855f7)'
                                                }}
                                            >
                                                <p className="text-sm md:text-base break-words">{message.content}</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 md:space-y-4">
                                                {message.content && (
                                                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-lg border border-white/20">
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
                                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-lg border border-white/20">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" style={{ color: theme?.primaryColor || '#6366f1' }} />
                                        <span className="text-sm md:text-base text-gray-600">Thinking...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </main>

            {/* Input Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-2xl border-t border-white/20 p-3 md:p-4 safe-area-inset-bottom relative z-50">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    <div className="flex gap-2 md:gap-3 items-end">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm md:text-base"
                            disabled={isLoading}
                            style={{ fontSize: '16px' }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="rounded-2xl p-3 md:p-4 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex-shrink-0 text-white"
                            style={{
                                background: theme
                                    ? `linear-gradient(to right, ${theme.primaryColor}, ${theme.accentColor})`
                                    : 'linear-gradient(to right, #6366f1, #a855f7)'
                            }}
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
