const typescriptTransform = require("i18next-scanner-typescript");

module.exports = {
  input: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // Use ! to filter out files or directories
    "!src/**/*.spec.{js,jsx}",
    "!i18n/**",
    "!**/node_modules/**",
  ],
  // output: "./src/",
  options: {
    compatibilityJSON: "v3",
    debug: true,
    func: {
      list: ["i18next.t", "i18n.t", "t"],
      extensions: [".js", ".jsx"],
    },
    trans: {
      extensions: [".js", ".jsx"],
    },
    lngs: ["en", "tr"],
    ns: ["translation"],
    defaultLng: "en",
    defaultNs: "translation",
    resource: {
      loadPath: "./src/i18n/{{lng}}/{{ns}}.json",
      savePath: "./src/i18n/{{lng}}/{{ns}}.json",
    },
  },
  transform: typescriptTransform({
    // default value for extensions
    extensions: [".ts", ".tsx"],
    // optional ts configuration
    tsOptions: {
      target: "es2017",
    },
  }),
};
