// todo: 1.sourceMap 路径和id 映射存在限制   2. 不支持import结构 ast
const fs = require("fs");
const path = require("path");
const parse = require("@babel/parser").parse;
const traverse = require("@babel/traverse").default;
const babelCore = require("@babel/core");
const t = require('@babel/types');

const resolve = (url) => {
    const dirname = path.dirname(url);
    return path.join(dirname,url);
}
let ID = 0;
const sourceMap = {}
const createAsset = (fileName) => {
    const code = fs.readFileSync(fileName, 'utf-8');
    const ast = parse(code, {sourceType : "module"});
    const dependencies = []
    traverse(ast,{
        ImportDeclaration: function (path) {
            dependencies.push(path.node.source.value);
            const node = path.node
            const specifiers = node.specifiers

            //获取资源地址
            const source = t.StringLiteral(path.node.source.value)
            const id = ++ID;
            sourceMap[path.node.source.value.replace('./',"")] = id
            //获取变量名称
            const local = t.identifier(specifiers[0].local.name)
            const callee = t.identifier('__webpack_require__')
            const varExpression = t.callExpression(callee,[t.StringLiteral(id+"")])

            const declarator = t.variableDeclarator(local, varExpression)
            //创建新节点
            const newNode = t.variableDeclaration("const", [declarator])
            //节点替换
            path.replaceWith(newNode)
        }
    })
    const es5Module = babelCore.transformFromAstSync(ast,null,{
        "presets": [
            [
                "@babel/preset-env",
                {
                    // "targets": {
                    //     "esmodules": true,
                    // },
                    targets: "> 1%, not ie < 11",
                    useBuiltIns: "usage"
                }
            ]
        ]
    })
    // const id = ID++
    const id = sourceMap[Object.keys(sourceMap).find((key) => fileName.indexOf(key) !== -1)] || 0
    return {
        fileName: fileName,
        id,
        code: es5Module.code,
        dependencies
    }
}
const creategraph = (entry) => {
    const asset = createAsset(entry);
    const graph = [asset];
    for(let module of graph) {
        module.dependencies.forEach((fileName) => {
            const dirname = path.dirname(asset.fileName);
            const relativePath = fileName.indexOf('.js') !== -1 ? fileName: `${fileName}.js`
            const absolutePath = path.join(dirname,relativePath);
            graph.push(createAsset(absolutePath))
        })
    }
    return graph;
}

const bundle = (graph) => {
    let modules = ""
    graph.forEach(module => {
        modules += `${module.id}: function(module, exports, __webpack_require__) {${module.code}},`
    })
    const result = `(function(modules) {
      // 缓存所有被加载过的模块(文件)
      const installedModules = {};
      const sourceMap = ${JSON.stringify(sourceMap)}      
      // 模块(文件)加载器 moduleId 一般就是文件路径
      function __webpack_require__(moduleId) {
        // 走 cache
        if (installedModules[moduleId]) {
          return installedModules[moduleId].exports;
        }
        // Create a new module (and put it into the cache) 解释比我清楚
        const module = (installedModules[moduleId] = {
          i: moduleId,
          l: false,
          exports: {}
        });
        // 执行我们的模块(文件) 目前就是 ./src/index.ts 并且传入 3 个参数
        modules[moduleId].call(
          module.exports,
          module,
          module.exports,
          __webpack_require__
        );
        // Flag the module as loaded 解释比我清楚
        module.l = true;
        // Return the exports of the module 解释比我清楚
        return module.exports.default;
      }
      
      // 开始加载入口文件
      return __webpack_require__(0);
    })({ ${modules} })`;

    fs.writeFileSync('./bundle.js',result)
}

const graph = creategraph('./example/entry.js')
bundle(graph);
