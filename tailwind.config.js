/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#1f2937", // Dark background
        surface: "#2d3748", // Card surfaces
        primary: "#60a5fa", // Blue for active tint
        success: "#22c55e",
        error: "#ef4444",
        textPrimary: "#e5e7eb", // Light text
        textSecondary: "#9ca3af", // Muted text
      },
    },
  },
  plugins: [],
};
