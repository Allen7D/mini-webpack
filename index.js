const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("babel-core");
const path = require("path");
const ejs = require("ejs");
let id = 0;

let globalConfig = {};
const EJS_TEMPLATE_PATH = path.join(__dirname, "./bundle.ejs");

/**
 *
 * @param {*} filename
 * @returns
 */
function createAsset(filename) {
  // 1. 读取文件的内容
  let source = fs.readFileSync(filename, "utf-8");
  // 2. 使用 AST 解析，获取到文件的依赖关系
  const ast = parser.parse(source, {
    sourceType: "module",
  });
  const deps = []; // 导入的相关依赖
  // 3. 从 AST 中获取到导入的依赖的文件地址
  traverse(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value); // node.source.value 为依赖的文件地址
    },
  });

  // es6+ -> es5
  // 将 commonjs 规范的导入导出，转为 esm 规范的导入导出
  // import from 转为 require，export 转为
  const { code } = transformFromAst(ast, null, {
    presets: ["env"],
  });

  return {
    id: id++, // 唯一id
    filename,
    code,
    deps,
    mapping: {},
  };
}

/**
 *
 * @returns
 */
function createGraph() {
  const filename = globalConfig.entry;
  const mainAsset = createAsset(filename);
  const dirname = path.dirname(filename); // entry 文件所在的文件夹，以此为路径的相对点

  const queue = [mainAsset];

  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAsset(path.resolve(dirname, relativePath));
      asset.mapping[relativePath] = child.id; // 构建 mapping
      queue.push(child);
    });
  }
  return queue;
}

/**
 *
 * @param {*} graph
 */
function bundle(graph) {
  // 先去构建 modules
  function createModules() {
    const modules = {};
    graph.forEach((asset) => {
      modules[asset.id] = [asset.code, asset.mapping];
    });

    return modules;
  }

  const modules = createModules();
  const bundleTemplate = fs.readFileSync(EJS_TEMPLATE_PATH, "utf-8");
  const code = ejs.render(bundleTemplate, {
    modules,
  });

  emitFile(code);
}

function emitFile(context) {
  const { output: filePath } = globalConfig;
  fs.writeFileSync(filePath, context);
}

function webpack(config) {
  globalConfig = config;
  const graph = createGraph();

  bundle(graph);
}

const webpackConfig = {
  entry: "./example/src/main.js", // 打包的入口
  output: "./example/dist/bundle.js",
};

webpack(webpackConfig);
