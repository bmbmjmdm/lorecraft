import "./index.css";
import App from "../Navigation.tsx";
import AppRegistry from "react-native-web/dist/exports/AppRegistry/index.js";

AppRegistry.registerComponent("App", () => App);

AppRegistry.runApplication("App", {
  rootTag: document.getElementById("root"),
});
