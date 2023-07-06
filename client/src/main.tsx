import { createRoot } from "react-dom/client";
import App from "./App";

let container = document.getElementById("root") as HTMLElement;
let root = createRoot(container);
root.render(<App />);
