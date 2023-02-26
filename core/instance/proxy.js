import { renderData } from "./render.js";

function proxyObject(vm, obj, namespace) {
  let pro_obj = {};
  for (const prop in obj) {
    Object.defineProperty(pro_obj, prop, {
      configurable: true,
      get() {
        return obj[prop];
      },
      set(val) {
        obj[prop] = val;
        renderData(vm, getNameSpace(prop, namespace));
      },
    });
    Object.defineProperty(vm, prop, {
      configurable: true,
      get() {
        return obj[prop];
      },
      set(val) {
        obj[prop] = val;
        renderData(vm, getNameSpace(prop, namespace));
      },
    });
    if (obj[prop] instanceof Object) {
      pro_obj[prop] = constructProxy(
        vm,
        obj[prop],
        getNameSpace(prop, namespace)
      );
    }
  }
  return pro_obj;
}

function getNameSpace(nowProp, namespace) {
  if (namespace == "" || namespace == null) {
    return nowProp;
  } else if (nowProp == null || nowProp == "") {
    return namespace;
  } else {
    return namespace + "." + nowProp;
  }
}
function proxyArray(vm, arr, namespace) {
  let pro_arr = {
    eleType: "Array",
    toString: function () {
      return Array.prototype.join(arr, ",");
    },
    push() {},
    pop() {},
    shift() {},
    unshit() {},
  };
  defineArrPrototype(pro_arr, "push", namespace, vm);
  defineArrPrototype(pro_arr, "pop", namespace, vm);
  defineArrPrototype(pro_arr, "shift", namespace, vm);
  defineArrPrototype(pro_arr, "unshift", namespace, vm);
  Object.setPrototypeOf(arr, pro_arr);
  return arr;
}
const ARR_PROTOTYPE = Array.prototype;
function defineArrPrototype(obj, func, namespace, vm) {
  Object.defineProperty(obj, func, {
    enumerable: true,
    configrable: true,
    value: function (...args) {
      let originFunc = ARR_PROTOTYPE[func];
      let result = originFunc.apply(this, args);
      console.log(getNameSpace("", namespace));
      return result;
    },
  });
}
/**
 *
 * @param {*} vm
 * @param {*} obj
 * @param {*} namespace
 */
export function constructProxy(vm, obj, namespace) {
  let vmObj = null;
  if (obj instanceof Array) {
    vmObj = new Array(obj.length);
    for (let i = 0; i < obj.length; i++) {
      vmObj[i] = constructProxy(vm, obj[i], namespace); // 对每一个元素进行判断
    }
    vmObj = proxyArray(vm, vmObj, namespace);
  } else if (obj instanceof Object) {
    vmObj = proxyObject(vm, obj, namespace);
  } else {
    if (!namespace) {
      throw new Error("data must be a object or array");
    }
    return obj;
  }
  return vmObj;
}
