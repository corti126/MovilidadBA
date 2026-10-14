// app.config.js
import { defineConfig } from "vinxi";
var app_config_default = defineConfig({
  routers: [
    {
      name: "client",
      type: "spa",
      target: "browser",
      entry: "./src/main.jsx",
      root: ".",
      base: "/"
    },
    {
      name: "server",
      type: "http",
      target: "node-server",
      entry: "./src/server.ts",
      root: "."
    }
  ]
});
export {
  app_config_default as default
};
