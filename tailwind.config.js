/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          DEFAULT: "#1F6F65",
          dark: "#14524A",
          tint: "#E3EEE9",
        },
        deep: {
          DEFAULT: "#0F2B26",
          2: "#143832",
        },
        amber: {
          DEFAULT: "#E39A2E",
          tint: "#FBF1DE",
        },
        clay: {
          DEFAULT: "#CF6F55",
          tint: "#F9EAE2",
        },
        ink: {
          DEFAULT: "#1B2A27",
          soft: "#5A6B66",
          faint: "#8A9791",
        },
        line: "#E4E1D6",
        canvas: "#F7F5EF",
        surface: "#FFFFFF",
        success: "#3E8E5A",
        warn: "#C9842B",
        danger: {
          DEFAULT: "#B4533A",
          tint: "#F7E7E1",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "22px",
        xl: "28px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(27, 42, 39, 0.05), 0 6px 20px rgba(27, 42, 39, 0.06)",
        float:
          "0 2px 6px rgba(27, 42, 39, 0.12), 0 12px 32px rgba(27, 42, 39, 0.18)",
        press: "0 1px 2px rgba(27, 42, 39, 0.08)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out": "cubic-bezier(0.77, 0, 0.175, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      scale: {
        97: "0.97",
        98: "0.98",
      },
    },
  },
  plugins: [],
};
