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
      options: {
        type: Object,
        default: {
          layoutMode: 'masonry',
          masonry: {
            gutter: 10
          }
        }
      },
      itemselector: {
        type: String,
        default: "item"
      },
      list: {
        type: Array,
        required: true
      }
    }

    var isotopeComponent ={
      props,

      render (h) {
        const slots = this.$slots.default || []
        slots.forEach( elt => addClass(elt, this.itemselector))
        return h('div', null, slots)
      },

      mounted () {
        const options = _.merge(this.options, {itemSelector: "." + this.itemselector}) 

        _.forOwn(options.getSortData, (value, key) => {
          if (_.isString(value))
            options.getSortData[key] = (itemElement) => {return itemElement[value];};
        });

        var update = (object) => {
          _.forOwn(object, (value, key) => {
            object[key] = (itemElement) => { return value.call(this, getItemVm(itemElement));};
          });
        };
        update(options.getSortData);      

        this.$nextTick( () => {
          const iso = new Isotope(this.$el, options)
          
          iso._requestUpdate= () => {
              if (iso._willUpdate)
                return

              iso._willUpdate = true
              this.$nextTick(() => {
                iso.arrange()
                iso._willUpdate=false
              });
            };  
          this.iso = iso
          this.link(true)
        })
      },

      beforedestroy () {
        this.iso.destroy()
      },

      beforeUpdate () {
        this._oldChidren = Array.prototype.slice.call(this.$el.children)
      },

      updated () {
        const newChildren = Array.prototype.slice.call(this.$el.children)
        const added = _.difference(newChildren, this._oldChidren)
        const removed = _.difference(this._oldChidren, newChildren)

        if ((!removed.length) && (!added.length))
          return;

        // this.$nextTick(function(){                   
        this.iso.remove(removed)
        this.iso.insert(added)
        this.iso._requestUpdate()
        // });    
        this.link(false)
      },

      methods: {
         link (first) {
          if (!this.$slots.default)
            return
          this.$slots.default.forEach( 
            (slot, index) => {
              const elmt = slot.elm
              if (elmt)
                elmt.__underlying_element= { vm : this.list[index], index }     
            })
        }
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
