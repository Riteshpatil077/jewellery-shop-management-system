/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: '#FFD700',
                royalBlue: '#1E3A8A',
            },
            fontFamily: {
                marathi: ['Noto Sans Devanagari', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
