// Tailwind v4 via PostCSS. The @tailwindcss/vite plugin's transform does not
// run under Vite 8 in this environment, so we compile Tailwind through PostCSS,
// which Vite always applies to CSS files.
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
