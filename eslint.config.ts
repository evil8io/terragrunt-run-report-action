import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "tests/fixtures/**", "tests/e2e/**"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
)
