import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#ffffff",
          secondary: "#EDE8F5", // Snuff
        },
        border: {
          primary: "#ADBBDA", // Pigeon Post
        },
        text: {
          primary: "#1e293b",
          secondary: "#64748b",
        },
        // Brand colors from the palette
        brand: {
          chambray: "#3D52A0", // Main blue
          cornflower: "#7091E6", 
          polo: "#8697C4",
          pigeon: "#ADBBDA",
          snuff: "#EDE8F5",
        },
        // Dark theme specific colors
        'dark-bg': '#0f172a', // slate-900
        'dark-bg-secondary': '#1e293b', // slate-800
        'dark-border': '#334155', // slate-700
        'dark-text': '#f1f5f9', // slate-100
        'dark-text-secondary': '#cbd5e1', // slate-300
      },
      fontFamily: {
        urbanist: ["var(--font-urbanist)", "Urbanist", "ui-sans-serif", "system-ui", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "6xl": "3.75rem", // 60px
        "9xl": "8rem", // 128px  
        "10xl": "10rem", // 160px
        "md": "1.125rem", // 18px
      },
      spacing: {
        "18": "4.5rem", // 72px
        "[5%]": "5%",
      },
      borderRadius: {
        "image": "0.75rem",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [],
};
export default config;