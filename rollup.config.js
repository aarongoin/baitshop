import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import cleanup from "rollup-plugin-cleanup";
import dts from "rollup-plugin-dts";
import pkg from "./package.json";

export default [
  {
    input: "src/baitshop.tsx",
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
      resolve(),
      commonjs(),
      typescript(),
      cleanup({
        comments: "none",
        extensions: ["js", "ts", "jsx", "tsx"]
      })
    ]
  },
  {
    input: "src/baitshop.tsx",
    external: ["react"],
    plugins: [
      typescript(),
      dts(),
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
