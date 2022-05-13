// modules 包括所有的「id、文件路径、函数」
(function (modules) {
  function require(id) {
    let module = { exports: {} };
    // mapping 是 { '文件路径名': id } 的 kv 关系
    // 通过 '文件路径名' 找到文件全局唯一的 id，再基于 id 去 module 里找下标为 0 的函数
    const [fn, mapping] = modules[id];

    function localRequire(filename) {
      const id = mapping[filename];
      return require(id);
    }

    fn(localRequire, module, module.exports);

    return module.exports;
  }

  require(0);
})({
  0: [
    function (require, module, exports) {
      "use strict";

      var _foo = require("./foo.js");

      (0, _foo.foo)();
      console.log("main");
    },
    { "./foo.js": 1 },
  ],

  1: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.foo = foo;

      var _bar = require("./bar.js");

      function foo() {
        (0, _bar.bar)();
        var dom = document.createElement("div");
        dom.textContent = "foo";
        document.body.appendChild(dom);
        console.log("foo");
      }
    },
    { "./bar.js": 2 },
  ],

  2: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.bar = bar;

      function bar() {
        var dom = document.createElement("div");
        dom.textContent = "bar";
        document.body.appendChild(dom);
        console.log("bar");
      }
    },
    {},
  ],
});
