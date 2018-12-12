class ColorList {
  constructor() {
    this.colorList = null
  }
  setList(val) {
    this.colorList = val
    console.log(1, this.colorList)
  }
  getColor(obj) {
    let data = this.getStyleId(obj)
    let objs = {
      color: "#ffffff",
      opacity: 1
    }
    if (data) {
      try {
        let style = JSON.parse(data.data)
        let type = style.type
        if (style.paint[type + '-color']) {
          objs.color = style.paint[type + '-color']
        }
        if (style.paint[type + '-opacity']) {
          objs.opacity = style.paint[type + '-opacity']
        }
      } catch (err) {
        console.log(err)
      }

    }
    return objs
  }
  getStyleId(obj) {
    if (!obj) {
      return
    }
    let forms = obj.forms
    let style = null
    for (let q = 0; q < forms.length; q++) {
      let form = forms[q]
      if (form.type == 23) {
        style = form.style
      }
    }
    if (style && style[0]) {
      return this.getStyle(style[0])
    } else {
      let styles = obj.otype.formStyles.styles

      for (let i = 0; i < styles.length; i++) {
        let sty = styles[i]
        if (sty.style == 3) {
          return this.getStyle(sty.id)
        }
      }
    }

    return null
  }
  getStyle(id) {
    if (!id) {
      return
    }
    for (let i = 0; i < this.colorList.length; i++) {
      let style = this.colorList[i]
      if (id == style.id) {
        return style
      }
    }
    return null
  }
}
let colorList = new ColorList()
export default colorList