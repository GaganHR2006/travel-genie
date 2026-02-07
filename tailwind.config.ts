import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            screens: {
                'xs': '475px',
            },
            animation: {
                'blob': 'blob 7s infinite',
                'spin': 'spin 1s linear infinite',
            },
        },
    },
    plugins: [],
};
export default config;
