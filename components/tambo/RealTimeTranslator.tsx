"use client";
import { motion } from "framer-motion";
import { Languages, ArrowRightLeft, Mic, Volume2, Copy, Check, Sparkles } from "lucide-react";
import { useState } from "react";

interface Props {
    sourceLang?: string;
    targetLang?: string;
    initialText?: string;
}

const languageOptions = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "id", name: "Indonesian", flag: "🇮🇩" },
    { code: "th", name: "Thai", flag: "🇹🇭" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
];

const mockTranslations: Record<string, Record<string, string>> = {
    en: {
        ja: "こんにちは、どこでおいしいラーメンが食べられますか?",
        fr: "Bonjour, où puis-je manger de bons ramen?",
        es: "Hola, ¿dónde puedo comer un buen ramen?",
        id: "Halo, di mana saya bisa makan ramen yang enak?",
        th: "สวัสดี ฉันสามารถกินราเม็งอร่อยได้ที่ไหน?",
    },
    ja: {
        en: "Hello, where can I eat good ramen?",
        fr: "Bonjour, où puis-je manger de bons ramen?",
    },
};

export default function RealTimeTranslator({ sourceLang = "en", targetLang = "ja", initialText = "" }: Props) {
    const [sourceLanguage, setSourceLanguage] = useState(sourceLang);
    const [targetLanguage, setTargetLanguage] = useState(targetLang);
    const [inputText, setInputText] = useState(initialText || "Hello, where can I eat good ramen?");
    const [isTranslating, setIsTranslating] = useState(false);
    const [copied, setCopied] = useState(false);

    // Get mock translation or generate placeholder
    const getTranslation = () => {
        if (!inputText) return "";
        return mockTranslations[sourceLanguage]?.[targetLanguage] ||
            `[Translation to ${languageOptions.find(l => l.code === targetLanguage)?.name}]`;
    };

    const translatedText = getTranslation();

    const sourceLangData = languageOptions.find(l => l.code === sourceLanguage) || languageOptions[0];
    const targetLangData = languageOptions.find(l => l.code === targetLanguage) || languageOptions[1];

    const handleSwap = () => {
        setSourceLanguage(targetLanguage);
        setTargetLanguage(sourceLanguage);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(translatedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSpeak = (text: string, lang: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            speechSynthesis.speak(utterance);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-6 shadow-xl border border-blue-200 dark:border-blue-800 max-w-2xl"
        >
            {/* Header */}
            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4"
            >
                <Languages className="text-blue-600" />
                Real-Time Translator
                <Sparkles className="w-4 h-4 text-amber-500" />
            </motion.h2>

            {/* Language Selectors */}
            <div className="flex items-center gap-3 mb-4">
                <select
                    value={sourceLanguage}
                    onChange={(e) => setSourceLanguage(e.target.value)}
                    className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {languageOptions.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                        </option>
                    ))}
                </select>

                <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSwap}
                    className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors"
                >
                    <ArrowRightLeft className="w-5 h-5" />
                </motion.button>

                <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {languageOptions.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Input Box */}
            <div className="relative mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{sourceLangData.flag}</span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{sourceLangData.name}</span>
                </div>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type or speak to translate..."
                    rows={3}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="absolute right-3 bottom-3 flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSpeak(inputText, sourceLanguage)}
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Listen"
                    >
                        <Volume2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        title="Voice input"
                    >
                        <Mic className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>

            {/* Translation Output */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-4 relative"
            >
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{targetLangData.flag}</span>
                    <span className="text-sm font-medium text-blue-100">{targetLangData.name}</span>
                </div>

                {isTranslating ? (
                    <div className="flex items-center gap-2 py-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span className="text-blue-100">Translating...</span>
                    </div>
                ) : (
                    <p className="text-xl font-medium leading-relaxed min-h-[60px]">
                        {translatedText}
                    </p>
                )}

                {/* Action buttons */}
                <div className="absolute right-3 bottom-3 flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSpeak(translatedText, targetLanguage)}
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                        title="Listen"
                    >
                        <Volume2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCopy}
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                        title="Copy"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                    </motion.button>
                </div>
            </motion.div>

            {/* Tip */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center"
            >
                💡 Tip: Speak clearly into your device's microphone for voice translation
            </motion.p>
        </motion.div>
    );
}
