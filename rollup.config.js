import typescript from "@rollup/plugin-typescript";

export default {
  input: ["dist/client/index.js"],
  output: {
    sourcemap: true,
    file: "public/assets/scripts/bundle.js",
    format: "esm",
  },

  plugins: [],

  //  treeshake: true,
};
