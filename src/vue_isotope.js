(function(){
  function buildVueIsotope(_, Isotope){

    function addClass(node, classValue){
      const initValue = (node.data.staticClass === undefined) ? "" : node.data.staticClass + " "
      node.data.staticClass = initValue + classValue
    }

    function getItemVm(element){
      return null
    }

    function getItemHTLM(element,id){
      return null
    }

    const props = {
      options : Object,
      itemselector : {
        type: String,
        required: true
      }
    }

    var isotopeComponent ={
      props,

      render (h) {
        const slots = this.$slots.default
        slots.forEach( elt => addClass(elt, this.itemselector))
        return h('div', null, this.$slots.default)
      },

      mounted () {
        const options = _.merge(this.options.itemSelector, {itemSelector: "." + this.itemselector}) 
        var update = (object) => {
          _.forOwn(object, (value, key) => {
            object[key] = (itemElement) => { return value.call(ctx.vm, getItemVm(itemElement));};
          });
        };
        update(options.getSortData);
        
        this.$nextTick( () => {
          this.iso = new Isotope(this.$el, options);
        })
      },

      beforedestroy (){
        this.iso.destroy()
      }
    };

    return isotopeComponent;
  }

  if (typeof exports == "object") {
    var _ = require("lodash"), Isotope = require("isotope-layout");
    module.exports = buildVueIsotope(_, Isotope);
  } else if (typeof define == "function" && define.amd) {
    define(['lodash','Isotope'], function(_, Isotope){ return buildVueIsotope(_, Isotope); });
  } else if ((window.Vue) && (window._) && (window.Isotope)) {
    var isotope = buildVueIsotope(window._, window.Isotope);
    Vue.component('isotope', isotope)
  }
})();
