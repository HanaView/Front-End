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
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    "eslint-config-prettier"
  ],
  settings: {
    react: {
      version: "detect"
    },
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
        extensions: [".js", ".jsx"]
      }
    }
  },
  rules: {
    "react/jsx-uses-vars": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": "off"
  },
  overrides: [
    {
      files: ["*.js"],
      parser: "@babel/eslint-parser",
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        requireConfigFile: false
      },
      rules: {
        "no-undef": "off"
      }
    }
  ]
};
