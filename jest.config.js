module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFiles: [
    "./node_modules/react-native-gesture-handler/jestSetup.js",
    "./jestSetup.js"
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|unimodules-permissions-interface|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base)"
  ]
};
