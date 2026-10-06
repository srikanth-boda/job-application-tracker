import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Architecture guard: the Razorpay SDK may only be imported inside the Razorpay provider folder.
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "razorpay",
              message:
                "Import the Razorpay SDK only inside services/payments/razorpay/. Use PaymentService elsewhere.",
            },
          ],
        },
      ],
    },
  },
  { files: ["services/payments/razorpay/**"], rules: { "no-restricted-imports": "off" } },
];

export default config;
