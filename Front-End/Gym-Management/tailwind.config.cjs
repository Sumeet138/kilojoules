const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gym: {
          beige: "#F5F0E8",
          "beige-dark": "#E8DFD0",
          "beige-medium": "#D4C5B0",
          cream: "#FAF7F2",
          warm: "#C9A96E",
          "warm-dark": "#A07840",
          brown: "#6B4C2A",
          "brown-dark": "#4A3218",
          accent: "#8B6914",
          charcoal: "#2D2926",
          "text-primary": "#3D2E1E",
          "text-secondary": "#7A6652",
          "text-muted": "#A89580",
        },
      },
      fontFamily: {
        gym: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
});
