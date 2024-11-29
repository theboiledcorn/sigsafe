/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./src/*.{js,ts,jsx,tsx}"],
    theme: {
        screens: {
            sm: "640px", // Mobile
            md: "768px", // Tablet
            lg: "1024px", // Small Desktop
            xl: "1280px", // Desktop
            "2xl": "1536px", // Large Desktop
        },
        extend: {
            colors: {
                "royal-purple": "#4C1D95",
                "bright-purple": "#6D28D9",
                "vivid-lavender": "#8B5CF6",
                "light-lavender": "#A78BFA",
                "soft-lilac": "#C4B5FD",
                "pale-lilac": "#EDE9FE",
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
        },
    },
    plugins: [],
    darkMode: "class",
};
