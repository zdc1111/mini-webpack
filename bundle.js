(function(modules) {
      // 缓存所有被加载过的模块(文件)
      const installedModules = {};
      const sourceMap = {"home.js":1,"login":2,"component.js":3}      
      // 模块(文件)加载器 moduleId 一般就是文件路径
      function __webpack_require__(moduleId) {
        // const key = Object.keys(sourceMap).find((key) => path.indexOf(key) !== -1)
        // const moduleId = sourceMap[key];
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
    })({ 0: function(module, exports, __webpack_require__) {"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es7.promise.finally");

var home = __webpack_require__("1");

var login = __webpack_require__("2");

Promise.resolve().finally(function () {
  console.log(home, login, 1111);
});
console.log(home, login);},1: function(module, exports, __webpack_require__) {"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var component = __webpack_require__("3");

var _default = "< Home> ".concat(component, "</Home>");

exports.default = _default;},2: function(module, exports, __webpack_require__) {"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var login = 'login';
var _default = login;
exports.default = _default;},3: function(module, exports, __webpack_require__) {"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var name = 'Component';
var _default = name;
exports.default = _default;}, })
