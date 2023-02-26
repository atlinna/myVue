export default class VNode {
    env = {}; // 当前节点所处环境变量
    instructions = null; // 指令
    template = []; // 涉及的模板
    constructor(tag,elm,children,text,data,parent,nodeType,){
        this.tag = tag; // 标签类型
        this.elm = elm; // 真实节点
        this.children = children; // 子节点
        this.text = text; // 文本内容
        this.data = data; // 虚拟节点的数据
        this.parent = parent; // 父节点
        this.nodeType = nodeType; // 节点类型
    }
}
