const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gym: {
          beige: "#FFFBF0",
          "beige-dark": "#FFF5E0",
          "beige-medium": "#FFE8CC",
          cream: "#FFFFFF",
          warm: "#F97316",
          "warm-dark": "#EA580C",
          brown: "#D97706",
          "brown-dark": "#B45309",
          accent: "#F59E0B",
          charcoal: "#1C1917",
          "text-primary": "#292524",
          "text-secondary": "#78716C",
          "text-muted": "#A8A29E",
        },
      },
      fontFamily: {
        gym: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
});
