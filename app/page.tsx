"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Plane, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

interface DestinationTheme {
  backgroundImage: string;
  gradient: string;
  primaryColor: string;
  accentColor: string;
  emojis: string[];
  vibe: string;
  particleColor: string;
  destination: string;
}

export default function LandingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"landing" | "form">("landing");
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "",
  });
  const [showTrolley, setShowTrolley] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<DestinationTheme | null>(null);
  const [isLoadingTheme, setIsLoadingTheme] = useState(false);
  const [destinationInput, setDestinationInput] = useState("");
  const [landingParticles, setLandingParticles] = useState<Array<{ top: string; left: string; duration: number; delay: number }>>([]);
  const [formParticles, setFormParticles] = useState<Array<{ top: string; left: string; width: string; height: string; duration: number; delay: number }>>([]);

  useEffect(() => {
    setLandingParticles(
      [...Array(50)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 2,
      }))
    );

    setFormParticles(
      [...Array(30)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 4 + 2}px`,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  // Debounced theme fetching
  useEffect(() => {
    if (!destinationInput || destinationInput.length < 3) return;

    const timer = setTimeout(async () => {
      setIsLoadingTheme(true);
      try {
        const response = await fetch("/api/destination-theme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destination: destinationInput }),
        });

        if (response.ok) {
          const theme = await response.json();
          setCurrentTheme(theme);
        }
      } catch (error) {
        console.error("Failed to fetch theme:", error);
      } finally {
        setIsLoadingTheme(false);
      }
    }, 1000); // Wait 1s after user stops typing

    return () => clearTimeout(timer);
  }, [destinationInput]);

  useEffect(() => {
    if (currentTheme) {
      console.log("🎨 Current Theme:", currentTheme);
      console.log("🖼️ Background Image:", currentTheme.backgroundImage);
    }
  }, [currentTheme]);

  const handleGetStarted = () => {
    setShowTrolley(true);
    setTimeout(() => {
      setStep("form");
      setShowTrolley(false);
    }, 2000);
  };

  const handleSubmit = () => {
    if (!formData.destination || !formData.days || !formData.budget) return;

    sessionStorage.setItem("tripDetails", JSON.stringify({
      ...formData,
      theme: currentTheme,
    }));
    setShowTrolley(true);

    setTimeout(() => {
      router.push("/chat");
    }, 2000);
  };

  const handleDestinationChange = (value: string) => {
    setDestinationInput(value);
    setFormData({ ...formData, destination: value });
  };

  const isFormValid = formData.destination && formData.days && formData.budget;

  // Particle colors based on theme
  const particleColor = currentTheme?.particleColor || "#ffffff";

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
          /* ========== LANDING PAGE ========== */
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen relative"
          >
            {/* World Map Background (Use fixed URL or static image) */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1920&q=80')",
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-pink-900/90" />

            {/* Animated Stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {landingParticles.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: p.top,
                    left: p.left,
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    delay: p.delay,
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 1.2 }}
                className="mb-8"
              >
                <motion.div
                  animate={{ y: [0, -20, 0], rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-gradient-to-br from-blue-400 to-purple-600 p-8 rounded-full shadow-2xl"
                >
                  <Globe className="w-24 h-24 text-white" />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-8"
              >
                <h1 className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tight">
                  Travel Genie
                </h1>
                <p className="text-3xl md:text-4xl text-white/90 font-light italic mb-2">
                  "Adventure awaits those who dare to explore"
                </p>
                <p className="text-xl md:text-2xl text-white/70">
                  Your AI-powered travel companion ✨
                </p>
              </motion.div>

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
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20"
                  >
                    <span className="text-white font-semibold">
                      {feature.icon} {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="bg-white px-12 py-6 rounded-full text-2xl font-black shadow-2xl hover:shadow-white/50 transition-all flex items-center gap-3"
              >
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Start Your Journey
                </span>
                <ArrowRight className="w-7 h-7 text-blue-600" />
              </motion.button>

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
          /* ========== DYNAMIC FORM PAGE ========== */
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen relative overflow-hidden"
          >
            {/* Dynamic Background */}
            {/* Dynamic Background - CRITICAL: Must be visible */}
            <motion.div
              key={currentTheme?.backgroundImage || "default"}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: currentTheme?.backgroundImage
                  ? `url('${currentTheme.backgroundImage}')`
                  : "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Gradient Overlay - LIGHTER for better visibility */}
            <motion.div
              key={currentTheme?.gradient || "default-gradient"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className={`absolute inset-0 bg-gradient-to-br ${currentTheme?.gradient || "from-indigo-600/80 via-purple-600/80 to-pink-600/80"
                }`}
              style={{ mixBlendMode: 'multiply' }} // Better image visibility
            />

            {/* Dynamic Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {formParticles.map((p, i) => (
                <motion.div
                  key={`particle-${i}-${currentTheme?.destination || 'default'}`}
                  className="absolute rounded-full"
                  style={{
                    width: p.width,
                    height: p.height,
                    backgroundColor: particleColor,
                    top: p.top,
                    left: p.left,
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1],
                    y: [0, -30, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    delay: p.delay,
                  }}
                />
              ))}
            </div>

            {/* Destination Badge */}
            <AnimatePresence>
              {currentTheme && (
                <motion.div
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  className="absolute top-8 left-1/2 -translate-x-1/2 z-20"
                >
                  <div className="bg-white/20 backdrop-blur-xl px-6 py-3 rounded-full border border-white/30 flex items-center gap-2">
                    <span className="text-2xl">{currentTheme.emojis[0]}</span>
                    <span className="text-white font-bold">Exploring: {currentTheme.destination}</span>
                    <span className="text-2xl">{currentTheme.emojis[1]}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
              <div className="w-full max-w-2xl">
                {/* Floating Plane */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-center mb-8"
                >
                  <div className="text-8xl">{currentTheme?.emojis[0] || "✈️"}</div>
                </motion.div>

                {/* Title */}
                <div className="text-center mb-12">
                  <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                    Travel Genie
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 font-medium italic mb-2 drop-shadow">
                    "A heart full of adventure and a world to Explore Experience Evolve with travelGenie"
                  </p>
                </div>

                {/* Form Card with Glassmorphism */}
                <motion.div
                  initial={{ y: 50, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
                    Plan Your Dream Trip {currentTheme?.emojis[1] || "✨"}
                  </h2>

                  <div className="space-y-6">
                    {/* Destination Input */}
                    <div>
                      <label className="block text-white/90 font-semibold mb-3 text-lg">
                        📍 Where do you want to go?
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={destinationInput}
                          onChange={(e) => handleDestinationChange(e.target.value)}
                          placeholder="e.g., Karnataka, Tokyo, Bali..."
                          className="w-full px-6 py-4 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-lg font-medium"
                          style={{ fontSize: '16px' }}
                        />
                        {isLoadingTheme && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                            />
                          </div>
                        )}
                      </div>
                      {currentTheme && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-white/70 italic"
                        >
                          {currentTheme.vibe}
                        </motion.p>
                      )}
                    </div>

                    {/* Days Input */}
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
                        style={{ fontSize: '16px' }}
                      />
                    </div>

                    {/* Budget Input */}
                    <div>
                      <label className="block text-white/90 font-semibold mb-3 text-lg">
                        💰 What's your budget? (INR)
                      </label>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="e.g., 25000"
                        min="1000"
                        className="w-full px-6 py-4 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-lg font-medium"
                        style={{ fontSize: '16px' }}
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                      whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                      onClick={handleSubmit}
                      disabled={!isFormValid}
                      className={`w-full py-5 rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-all mt-8 ${isFormValid
                        ? "bg-white text-transparent bg-clip-text shadow-2xl hover:shadow-white/50"
                        : "bg-white/20 text-white/50 cursor-not-allowed"
                        }`}
                      style={{
                        background: isFormValid
                          ? `linear-gradient(to right, ${currentTheme?.primaryColor || '#6366f1'}, ${currentTheme?.accentColor || '#a855f7'})`
                          : undefined,
                      }}
                    >
                      {isFormValid ? (
                        <>
                          <span className="text-white">Let's Go!</span>
                          <Plane className="w-6 h-6 text-white" />
                        </>
                      ) : (
                        "Fill all fields to continue"
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
                  className="mt-6 text-white/70 hover:text-white transition-colors mx-auto block text-sm z-20 relative"
                >
                  ← Back to Home
                </button>
              </div>
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