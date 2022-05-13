export function bar() {
  const dom = document.createElement("div");
  dom.textContent = "bar";
  document.body.appendChild(dom);
  console.log("bar");
}
