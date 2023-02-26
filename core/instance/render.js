import { getValue } from "../utils/ObjectUtil.js";
// 通过模板找到哪些节点用到了这个模板
let template2VNode = new Map();
// 通过节点找到，这个节点用了哪些模板
let vnode2Template = new Map();

export function prepareRender(vm, vnode) {
  if (vnode === null) return;
  if (vnode.nodeType == 3) {
    //文本节点
    analysisTemplateString(vnode);
  }
  if (vnode.nodeType == 1) {
    // 实体标签
    for (let i = 0; i < vnode.children.length; i++) {
      prepareRender(vm, vnode.children[i]);
    }
  }
}

function analysisTemplateString(vnode) {
  let templateString = vnode.text.match(/{{[a-zA-Z0-9._\s]+}}/g);
  //   console.log(templateString);
  for (let i = 0; templateString && i < templateString.length; i++) {
    setTemplate2VNode(templateString[i], vnode);
    setVNode2Template(templateString[i], vnode);
  }
}

function setTemplate2VNode(template, vnode) {
  let templateName = getTemplateName(template);
  let vnodeMap = template2VNode.get(templateName);
  if (vnodeMap) {
    vnodeMap.push(vnode);
  } else {
    template2VNode.set(templateName.trim(), [vnode]);
  }
}

function setVNode2Template(template, vnode) {
  let tempMap = vnode2Template.get(vnode);
  if (tempMap) {
    tempMap.push(getTemplateName(template));
  } else {
    vnode2Template.set(vnode, [getTemplateName(template)]);
  }
}

function getTemplateName(template) {
  if (
    template &&
    template.substring(0, 2) == "{{" &&
    template.substring(template.length - 2, template.length)
  ) {
    return template.substring(2, template.length - 2);
  }
  return template;
}

export function getTemplate2Vnode() {
  return template2VNode;
}

export function getVNode2Template() {
  return vnode2Template;
}

export function initRender(myVue) {
  myVue.prototype._render = function () {
    renderNode(this, this._vnode);
  };
}

export function renderData(vm, template) {
  console.log(template);
  const vnodes = template2VNode.get(template);
  if (vnodes) {
    for (let i = 0; i < vnodes.length; i++) {
      renderNode(vm, vnodes[i]);
    }
  }
}

export function renderNode(vm, vnode) {
  if (vnode.nodeType == 3) {
    // 直接渲染
    let templates = vnode2Template.get(vnode);
    if (templates) {
      let result = vnode.text;
      for (let i = 0; i < templates.length; i++) {
        let templateVal = getTemplateVal([vm._data, vnode.env], templates[i]);
        if (templateVal) {
          result = result.replace("{{" + templates[i] + "}}", templateVal);
        }
      }
      vnode.elm.nodeValue = result;
      //   console.log(vnode.elm);
    }
  } else {
    for (let i = 0; i < vnode.children.length; i++) {
      renderNode(vm, vnode.children[i]);
    }
  }
}

export function getTemplateVal(objs, template) {
  for (let i = 0; i < objs.length; i++) {
    let val = getValue(objs[i], template);
    if (val != null) return val;
  }
  return null;
}
