import { useTransitionNavigate } from "../context/TransitionContext";
import { motion } from "framer-motion";
import GameBackground from "./GameBackground";

export default function HowToPlay() {
  const navigate = useTransitionNavigate();

  const steps = [
    {
      number: 1,
      title: "Role Distribution",
      icon: "🎭",
      gradient: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
      iconBg: "rgba(59, 130, 246, 0.15)",
      content: "Each player receives a hidden role:",
      points: [
        { icon: "👥", color: "#60a5fa", label: "Players:", text: "Know the secret word" },
        { icon: "🕵️", color: "#f87171", label: "Imposter:", text: "Doesn't know - must blend in!" },
      ],
    },
    {
      number: 2,
      title: "Discussion Round",
      icon: "💬",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
      iconBg: "rgba(124, 58, 237, 0.15)",
      content: "Take turns describing the word:",
      points: [
        { icon: "🤫", color: "#c084fc", text: "Keep descriptions vague, not obvious" },
        { icon: "🎯", color: "#e879f9", text: "Try to expose the imposter" },
        { icon: "🎪", color: "#f0abfc", text: "Imposter: listen and mimic the style!" },
      ],
      examples: ['"Hot or cold?"', '"Crowded or quiet?"', '"Indoor or outdoor?"'],
    },
    {
      number: 3,
      title: "Voting Time",
      icon: "🗳️",
      gradient: "linear-gradient(135deg, #ec4899 0%, #ef4444 100%)",
      iconBg: "rgba(239, 68, 68, 0.15)",
      content: "After discussion, vote for who you think is the imposter:",
      points: [
        { icon: "✅", color: "#4ade80", text: "Vote correctly → Locals win!" },
        { icon: "🎲", color: "#f97316", text: "Imposter guesses word → Imposter wins!" },
        { icon: "⏰", color: "#fbbf24", text: "Time runs out → Imposter gets one guess" },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      <GameBackground />
      <div className="absolute inset-0 z-0" style={{ background: "rgba(0,0,0,0.65)" }} />

      {/* Header with close button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 pt-8 pb-4"
      >
        <div className="flex items-center gap-3">
          <span
            className="text-4xl"
            style={{
              filter: "drop-shadow(0 2px 8px rgba(59, 130, 246, 0.5))",
            }}
          >
            📖
          </span>
          <div>
            <h1
              className="text-white font-extrabold text-3xl"
              style={{
                fontFamily: "'Segoe UI', Arial, sans-serif",
                letterSpacing: "-0.5px",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              How to Play
            </h1>
            <p
              className="text-white"
              style={{
                fontSize: "13px",
                opacity: 0.7,
                fontFamily: "'Segoe UI', Arial, sans-serif",
              }}
            >
              Master the game in 3 steps
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/home")}
          className="w-11 h-11 flex items-center justify-center rounded-xl text-white transition-all"
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </motion.div>

      {/* Scrollable content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex-1 overflow-y-auto px-6 pb-8"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.3) transparent",
        }}
      >
        <div className="max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <motion.div key={step.number} variants={cardVariants}>
              <div
                className="rounded-3xl p-6 mb-5 relative overflow-hidden"
                style={{
                  background: "rgba(15, 23, 42, 0.75)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                {/* Gradient accent on top */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: step.gradient,
                  }}
                />

                {/* Header section */}
                <div className="flex items-center gap-4 mb-5">
                  {/* Step number badge */}
                  <div
                    className="flex items-center justify-center shrink-0 relative"
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "20px",
                      background: step.gradient,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                    }}
                  >
                    <span className="text-5xl">{step.icon}</span>
                    <div
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-black text-white"
                      style={{
                        background: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(10px)",
                        border: "2px solid rgba(255,255,255,0.3)",
                        fontSize: "14px",
                      }}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex-1">
                    <h2
                      className="text-white font-extrabold text-2xl mb-1"
                      style={{
                        fontFamily: "'Segoe UI', Arial, sans-serif",
                        letterSpacing: "-0.3px",
                      }}
                    >
                      {step.title}
                    </h2>
                    <p
                      className="text-white"
                      style={{
                        fontSize: "14px",
                        opacity: 0.75,
                        fontFamily: "'Segoe UI', Arial, sans-serif",
                      }}
                    >
                      {step.content}
                    </p>
                  </div>
                </div>

                {/* Points list */}
                <div className="space-y-3 mb-4">
                  {step.points.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl p-3"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span className="text-2xl shrink-0" style={{ marginTop: "-2px" }}>
                        {point.icon}
                      </span>
                      <div className="flex-1">
                        {point.label && (
                          <span
                            className="font-bold"
                            style={{
                              color: point.color,
                              fontSize: "15px",
                              fontFamily: "'Segoe UI', Arial, sans-serif",
                            }}
                          >
                            {point.label}{" "}
                          </span>
                        )}
                        <span
                          className="text-white"
                          style={{
                            fontSize: "15px",
                            fontFamily: "'Segoe UI', Arial, sans-serif",
                          }}
                        >
                          {point.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Examples (only for step 2) */}
                {step.examples && (
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(124, 58, 237, 0.08)",
                      border: "1px solid rgba(124, 58, 237, 0.2)",
                    }}
                  >
                    <p
                      className="font-bold mb-2"
                      style={{
                        color: "#c084fc",
                        fontSize: "13px",
                        letterSpacing: "0.5px",
                        fontFamily: "'Segoe UI', Arial, sans-serif",
                      }}
                    >
                      💭 EXAMPLE QUESTIONS
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.examples.map((ex, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-3 py-1.5 rounded-lg text-white font-medium"
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            fontSize: "13px",
                            fontFamily: "'Segoe UI', Arial, sans-serif",
                          }}
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Pro Tip Card */}
          <motion.div variants={cardVariants}>
            <div
              className="rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(234, 179, 8, 0.1) 100%)",
                backdropFilter: "blur(20px)",
                border: "1.5px solid rgba(251, 191, 36, 0.3)",
                boxShadow: "0 8px 32px rgba(245, 158, 11, 0.2)",
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: "rgba(251, 191, 36, 0.2)",
                  border: "2px solid rgba(251, 191, 36, 0.4)",
                }}
              >
                <span className="text-4xl">💡</span>
              </div>
              <p
                className="font-extrabold mb-2"
                style={{
                  color: "#fbbf24",
                  fontSize: "20px",
                  letterSpacing: "0.5px",
                  fontFamily: "'Segoe UI', Arial, sans-serif",
                }}
              >
                Pro Tip for Imposters
              </p>
              <p
                className="text-white"
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  fontFamily: "'Segoe UI', Arial, sans-serif",
                  opacity: 0.9,
                }}
              >
                Listen carefully to others' descriptions. Use vague words that could fit any answer in the category. Mirror the group's tone and confidence level to stay hidden!
              </p>
            </div>
          </motion.div>

          {/* Ready button */}
          <motion.div variants={cardVariants} className="mt-6">
            <button
              onClick={() => navigate("/home")}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
                fontFamily: "'Segoe UI', Arial, sans-serif",
                border: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(59, 130, 246, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4)";
              }}
            >
              Got it, let's play! 
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}