"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Plane, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"landing" | "form">("landing");
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "",
  });
  const [showTrolley, setShowTrolley] = useState(false);
  const [stars, setStars] = useState<Array<{ top: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const generatedStars = [...Array(50)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
    setStars(generatedStars);
  }, []);

  const handleGetStarted = () => {
    setShowTrolley(true);
    setTimeout(() => {
      setStep("form");
      setShowTrolley(false);
    }, 2000);
  };

  const handleSubmit = () => {
    if (!formData.destination || !formData.days || !formData.budget) return;

    sessionStorage.setItem("tripDetails", JSON.stringify(formData));
    setShowTrolley(true);

    setTimeout(() => {
      router.push("/chat");
    }, 2000);
  };

  const isFormValid = formData.destination && formData.days && formData.budget;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Trolley Animation */}
      <AnimatePresence>
        {showTrolley && (
          <motion.div
            initial={{ x: "-10%", y: "50vh" }}
            animate={{ x: "110vw", y: "50vh" }}
            transition={{ duration: 2, ease: "linear" }}
            className="fixed z-50 text-9xl"
          >
            🧳🏃
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === "landing" ? (
          /* ========== LANDING PAGE (Step 1) ========== */
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen relative"
          >
            {/* World Map Background */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1920&q=80')",
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-pink-900/90" />

            {/* Animated Stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {stars.map((star, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: `${star.top}%`,
                    left: `${star.left}%`,
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: star.duration,
                    repeat: Infinity,
                    delay: star.delay,
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
              {/* Floating Globe */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 1.2 }}
                className="mb-8"
              >
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-gradient-to-br from-blue-400 to-purple-600 p-8 rounded-full shadow-2xl"
                >
                  <Globe className="w-24 h-24 text-white" />
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-8"
              >
                <h1 className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tight">
                  Travel Genie
                </h1>

                {/* Quotes Carousel */}
                <motion.div
                  key="quote1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <p className="text-3xl md:text-4xl text-white/90 font-light italic">
                    "Adventure awaits those who dare to explore"
                  </p>
                  <p className="text-xl md:text-2xl text-white/70">
                    Your AI-powered travel companion for unforgettable journeys
                  </p>
                </motion.div>
              </motion.div>

              {/* Feature Pills */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center gap-4 mb-12"
              >
                {[
                  { icon: "✨", text: "Smart Itineraries" },
                  { icon: "💰", text: "Budget Optimizer" },
                  { icon: "🤖", text: "AI-Powered" },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + idx * 0.1, type: "spring" }}
                    className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20"
                  >
                    <span className="text-white font-semibold">
                      {feature.icon} {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="bg-white text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 px-12 py-6 rounded-full text-2xl font-black shadow-2xl hover:shadow-white/50 transition-all flex items-center gap-3 relative overflow-hidden group"
                style={{ backgroundColor: "white" }}
              >
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Start Your Journey
                </span>
                <ArrowRight className="w-7 h-7 text-blue-600 group-hover:translate-x-2 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity" />
              </motion.button>

              {/* Powered By */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-8 text-white/50 text-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Powered by Tambo AI & Groq
              </motion.p>
            </div>
          </motion.div>
        ) : (
          /* ========== FORM PAGE (Step 2) ========== */
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden flex items-center justify-center p-4"
          >
            {/* Animated Stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {stars.map((star, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: `${star.top}%`,
                    left: `${star.left}%`,
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: star.duration,
                    repeat: Infinity,
                    delay: star.delay,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 w-full max-w-2xl">
              {/* Floating Plane */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-center mb-8"
              >
                <div className="text-8xl">✈️</div>
              </motion.div>

              {/* Title */}
              <div className="text-center mb-12">
                <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
                  Travel Genie
                </h1>
                <p className="text-xl md:text-2xl text-white/90 font-light italic mb-2">
                  "Adventure awaits those who dare to explore"
                </p>
                <div className="flex items-center justify-center gap-2 text-white/70 text-sm mt-4">
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Powered Travel Planning</span>
                </div>
              </div>

              {/* Form Card */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                  Plan Your Dream Trip ✨
                </h2>

                <div className="space-y-6">
                  {/* Destination */}
                  <div>
                    <label className="block text-white/90 font-semibold mb-3 text-lg">
                      📍 Where do you want to go?
                    </label>
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="e.g., Tokyo, Paris, Bali..."
                      className="w-full px-6 py-4 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-lg font-medium"
                    />
                  </div>

                  {/* Days */}
                  <div>
                    <label className="block text-white/90 font-semibold mb-3 text-lg">
                      📅 How many days?
                    </label>
                    <input
                      type="number"
                      value={formData.days}
                      onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                      placeholder="e.g., 7"
                      min="1"
                      max="30"
                      className="w-full px-6 py-4 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-lg font-medium"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-white/90 font-semibold mb-3 text-lg">
                      💰 What's your budget? (USD)
                    </label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="e.g., 2000"
                      min="100"
                      className="w-full px-6 py-4 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-lg font-medium"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                    whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className={`w-full py-5 rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-all mt-8 ${isFormValid
                        ? "bg-white text-indigo-600 shadow-2xl hover:shadow-white/50"
                        : "bg-white/20 text-white/50 cursor-not-allowed"
                      }`}
                  >
                    {isFormValid ? (
                      <>
                        Let's Go! <Plane className="w-6 h-6" />
                      </>
                    ) : (
                      <>Fill all fields to continue</>
                    )}
                  </motion.button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-white/60 text-sm">Powered by Tambo AI & Groq ⚡</p>
                </div>
              </motion.div>

              {/* Back Button */}
              <button
                onClick={() => setStep("landing")}
                className="mt-6 text-white/70 hover:text-white transition-colors mx-auto block text-sm"
              >
                ← Back to Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white !important;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.2) inset !important;
        }
      `}</style>
    </div>
  );
}