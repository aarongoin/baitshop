import typescript from "@rollup/plugin-typescript";
import cleanup from "rollup-plugin-cleanup";
import pkg from "./package.json";

export default [
  {
    input: "src/index.tsx",
    external: ["react"],
    output: {
      name: "baitshop",
      file: pkg.browser,
      format: "umd",
      globals: {
        react: "React"
      }
    },
    plugins: [
      typescript(),
      cleanup({
        comments: "none",
        extensions: ["js", "ts", "jsx", "tsx"]
      })
    ]
  },
  {
    input: "src/index.tsx",
    external: ["react"],
    plugins: [
      typescript(),
      cleanup({
        comments: "none",
        extensions: ["js", "ts", "jsx", "tsx"]
      })
    ],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ]
  }
];
