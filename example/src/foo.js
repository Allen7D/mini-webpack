import { bar } from "./bar.js";

export function foo() {
  bar();

  const dom = document.createElement("div");
  dom.textContent = "foo";
  document.body.appendChild(dom);
  console.log("foo");
}
