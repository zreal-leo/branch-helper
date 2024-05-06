import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        rules: {
            eqeqeq: "error",
            "no-unused-vars": "warn",
            "no-unreachable": "warn",
            "vue/multi-word-component-names": "off"
        }
    }
];
