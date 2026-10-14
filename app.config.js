export default {
  mode: "development",
  routers: [
    {
      name: "client",
      type: "spa",
      target: "browser",
      handler: "./src/main.jsx",
      root: ".",
      base: "/",
    },
  ],
};