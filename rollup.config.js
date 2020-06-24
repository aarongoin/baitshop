import typescript from "@rollup/plugin-typescript";
import cleanup from "rollup-plugin-cleanup";
import pkg from "./package.json";

export default [
  // react builds
  {
    input: "src/react/index.tsx",
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
    input: "src/react/index.tsx",
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
  },
  // preact builds
  {
    input: "src/preact/index.tsx",
    external: ["preact"],
    output: {
      name: "baitshop",
      file: `p${pkg.browser}`,
      format: "umd",
      globals: {
        preact: "React"
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
    input: "src/preact/index.tsx",
    external: ["preact"],
    plugins: [
      typescript(),
      cleanup({
        comments: "none",
        extensions: ["js", "ts", "jsx", "tsx"]
      })
    ],
    output: [
      { file: `p${pkg.main}`, format: "cjs" },
      { file: `p${pkg.module}`, format: "es" }
    ]
  }
];
