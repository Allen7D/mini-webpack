(function (modules) {
  function require(filePath) {
    const fn = modules[filePath];
    const module = {
      exports: {},
    };
    fn(require, module, module.exports);
    // module 作为引用类型，在 fn 中被修改
    return module.exports;
  }

  require("./main.js");
})({
  "./foo.js": function (require, module, exports) {
    function foo() {
      console.log("foo");
    }

    module.exports = {
      foo,
    };
  },
  "./main.js": function (require, module, exports) {
    const { foo } = require("./foo.js"); // 获取到

    foo();
    console.log("main");
  },
});
