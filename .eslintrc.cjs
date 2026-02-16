module.exports = {
  extends: ["next/core-web-vitals"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "out/",
    "dist/",
    "build/",
    "coverage/",
    "src-tauri/target/",
    "src-tauri/**/target/",
    "**/*.config.js"
  ]
};
