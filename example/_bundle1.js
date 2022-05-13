function require(filePath) {
  const map = {
    "./foo.js": foojs,
    "./main.js": mainjs,
  };

  const fn = map[filePath];
  const module = {
    exports: {},
  };
  fn(require, module, module.exports);
  // module 作为引用类型，在 fn 中被修改
  return module.exports;
}

require("./main.js");

function mainjs(require, module, exports) {
  const { foo } = require("./foo.js");

  foo();
  console.log("main");
}

function foojs(require, module, exports) {
  function foo() {
    console.log("foo");
  }

  module.exports = {
    foo,
  };
}
