module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        container: {
            center: true,
            padding: "1rem",
            screens: {
                default: "1400px",
            },
        },
        extend: {
            colors: {
                primary: "#DA0037",
                dark: "#1A1A1D",
                black: "#000000",
                light: "#808080",
                white: "#FFFFFF",
            },
        },
    },
    plugins: [],
};
