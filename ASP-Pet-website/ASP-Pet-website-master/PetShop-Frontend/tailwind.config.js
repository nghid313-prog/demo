/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ['Lexend Mega', 'sans-serif'],
                body: ['Public Sans', 'sans-serif'],
            },
            colors: {
                primary: "#FFDE59", // Pop Yellow
                secondary: "#FF5757", // Bright Red
                accent: "#2196F3", // Blue
                success: "#4ADE80",
                warning: "#FBBF24",
                error: "#EF4444",
                background: "#FFFBEB",
                surface: "#FFFFFF",
                'text-primary': "#0F172A",
                'text-secondary': "#64748B",
            },
            borderRadius: {
                'brutal': '1rem',
                'brutal-lg': '1.5rem',
                'brutal-xl': '2rem',
                'brutal-2xl': '3rem',
            },
            boxShadow: {
                'brutal': '8px 8px 0px 0px rgba(0,0,0,1)',
                'brutal-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
                'brutal-lg': '12px 12px 0px 0px rgba(0,0,0,1)',
                'brutal-hover': '4px 4px 0px 0px rgba(0,0,0,1)',
            },
            transitionProperty: {
                'brutal': 'transform, box-shadow, background-color',
            },
            transitionDuration: {
                '150': '150ms',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}

