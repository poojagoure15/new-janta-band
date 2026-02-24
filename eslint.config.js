import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
        globals: {
            document: "readonly",
            window: "readonly",
            navigator: "readonly",
            alert: "readonly",
            console: "readonly",
            setInterval: "readonly",
            clearInterval: "readonly",
            setTimeout: "readonly",
            lucide: "readonly",
            Razorpay: "readonly",
            process: "readonly",
            module: "readonly",
            require: "readonly",
            __dirname: "readonly",
            __filename: "readonly"
        }
    },
    rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "no-undef": "off"
    }
  }
);
