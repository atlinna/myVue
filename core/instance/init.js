import { constructProxy } from "./proxy.js";

let uid = 0;
export function initMyVue(myVue) {
  myVue.prototype._init = function (options) {
    const vm = this;
    vm.uid = uid;
    vm.isMyVue = true;
    uid += 1;
    // 初始化 data
    if (options && options.data) {
      vm._data = constructProxy(vm, options.data, "");
    }
    // 初始化 created 方法
    // 初始化 methods
    // 初始化 computed
    // 初始化 el 并挂载
    if (options && options.el) {
      vm.$mount(options.el);
    }
  };
}
