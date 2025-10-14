/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                // Legacy colors (keep for backward compatibility)
                "civika-green": "#2c5530",
                "civika-gold": "#FFD700",
                "civika-brown": "#8B4513",
                
                // Math-themed primary colors
                math: {
                    blue: "#3B82F6",
                    purple: "#8B5CF6",
                    orange: "#F59E0B",
                    green: "#10B981",
                    teal: "#14B8A6",
                },
                
                // Level-based themes
                level1: {
                    primary: "#F59E0B",
                    secondary: "#FCD34D",
                    accent: "#FB923C",
                    light: "#FEF3C7",
                },
                level2: {
                    primary: "#3B82F6",
                    secondary: "#60A5FA",
                    accent: "#8B5CF6",
                    light: "#DBEAFE",
                },
                
                // Semantic colors
                success: "#10B981",
                error: "#EF4444",
                warning: "#F59E0B",
                info: "#3B82F6",
            },
            fontFamily: {
                display: ["Montserrat", "sans-serif"],
                heading: ["Montserrat", "sans-serif"],
                body: ["Inter", "sans-serif"],
                sans: ["Inter", "sans-serif"],
                math: ["JetBrains Mono", "Courier New", "monospace"],
                playful: ["Quicksand", "Fredoka", "sans-serif"],
            },
            animation: {
                "bounce-soft": "bounce 1s ease-in-out infinite",
                "pulse-soft": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                shimmer: "shimmer 2s linear infinite",
                "slide-up": "slideUp 0.3s ease-out",
                "slide-down": "slideDown 0.3s ease-out",
                confetti: "confetti 1s ease-out forwards",
                celebrate: "celebrate 0.6s ease-out",
            },
            keyframes: {
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                slideUp: {
                    "0%": { transform: "translateY(100%)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                slideDown: {
                    "0%": { transform: "translateY(-100%)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                confetti: {
                    "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
                    "100%": { transform: "translateY(1000px) rotate(720deg)", opacity: "0" },
                },
                celebrate: {
                    "0%, 100%": { transform: "scale(1) rotate(0deg)" },
                    "25%": { transform: "scale(1.1) rotate(-5deg)" },
                    "75%": { transform: "scale(1.1) rotate(5deg)" },
                },
            },
            boxShadow: {
                soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07)",
                glow: "0 0 20px rgba(59, 130, 246, 0.3)",
                "glow-green": "0 0 20px rgba(16, 185, 129, 0.4)",
                "glow-orange": "0 0 20px rgba(245, 158, 11, 0.4)",
                "glow-purple": "0 0 20px rgba(139, 92, 246, 0.4)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "shimmer-gradient": "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            },
        },
    },
    plugins: [],
};
