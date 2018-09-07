/**
 * 元素拖拽指令
 */
const drag = {
  inserted(el, binding) {
    el.setAttribute("draggable", true);
    el.ondragstart = (event) => {
      var obj = {};
      obj.data = binding.value;
      event.dataTransfer.setData("Text", JSON.stringify(obj));
    }
  }
}

/**
 * 释放指令默认参数obj
 */
const drop = {
  inserted(el, binding) {
    var _this = this;
    el.ondragover = event => event.preventDefault();
    el.ondrop = event => {
      event.preventDefault();
      event.stopPropagation();
      var str = event.dataTransfer.getData("Text");
      var obj = JSON.parse(str);
      obj.event = event;
      binding.value(obj)
    }
  }
}



export {
  drop,
  drag
}
