import { initMyVue } from "./init.js";
import { initMount } from "./mount.js";
import { initRender } from './render.js';
function myVue(options) {
  this._init(options);
  this._render();
}

// 初始化 init 方法
initMyVue(myVue);
initMount(myVue);
initRender(myVue);

export default myVue;
