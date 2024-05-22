module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    // By extending from a plugin config, we can get recommended rules without having to add them manually.
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
    // Make sure it's always the last config, so it gets the chance to override other configs.
    "eslint-config-prettier"
  ],
  settings: {
    react: {
      version: "detect"
    },
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  rules: {
    // Add your own rules here to override ones from the extended configs.
    "react/jsx-uses-vars": "error",
    "react/react-in-jsx-scope": "off"
  },
  overrides: [
    {
      files: ["config.js"],
      parser: "@babel/eslint-parser",
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        requireConfigFile: false
      },
      rules: {
        "no-undef": "off"
      }
    },
    {
      files: ["config.js"],
      rules: {
        "no-undef": "off" // config.js 파일에서만 no-undef 규칙을 비활성화합니다.
      }
    }
  ]
};
