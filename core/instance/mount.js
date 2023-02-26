import VNode from "../vdom/vnode.js";
import {
  prepareRender,
  getTemplate2Vnode,
  getVNode2Template,
} from "./render.js";
export function initMount(myVue) {
  myVue.prototype.$mount = function (el) {
    let vm = this;
    let rootDom = document.getElementById(el);
    mount(vm, rootDom);
  };
}

export function mount(vm, el) {
  // begin mount 进行挂载
  vm._vnode = constructVNode(vm, el, null);
  // 进行预备渲染（建立渲染索引，通过模版找 vnode，通过 vnode 找模板）
  prepareRender(vm, vm._vnode);
}

/**
 * 深度优先，构建虚拟 DOM 树
 * @param {*} vm
 * @param {*} elm
 * @param {*} parent
 * @returns
 */
function constructVNode(vm, elm, parent) {
  let tag = elm.nodeName;
  let children = [];
  let text = getNodeText(elm);
  let data = null;
  let nodeType = elm.nodeType;
  let vnode = new VNode(tag, elm, children, text, data, parent, nodeType);

  let childs = vnode.elm.childNodes;
  for (let i = 0; i < childs.length; i++) {
    let childNode = constructVNode(vm, childs[i], vnode);
    if (childNode instanceof VNode) {
      vnode.children.push(childNode);
    } else {
      vnode.children = vnode.children.concat(childNode);
    }
  }
  return vnode;
}

function getNodeText(elm) {
  if (elm.nodeType == 3) {
    return elm.nodeValue;
  } else {
    return "";
  }
}
