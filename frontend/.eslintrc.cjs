/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "prettier/prettier": [
      "off",
      {
        "endOfLine": "auto",
      }
    ],
    "vue/multi-word-component-names": ["off", {
      "ignores": []
    }],
    // Note: you must disable the base rule as it can report incorrect errors
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    /*
    "prettier/prettier": [
      "warn",
      {
        "endOfLine": "auto",
      }
    ],
    */
  },
};
