(function(){
  function buildVueIsotope(_, Isotope){

    function addClass(node, classValue){
      const initValue = (node.data.staticClass === undefined) ? "" : node.data.staticClass + " "
      node.data.staticClass = initValue + classValue
    }

    function getItemVm(elmt){
      return elmt.__underlying_element
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
        },
        sort: String
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
            object[key] = (itemElement) => { const res =  getItemVm(itemElement); return value.call(this, res.vm, res.index);};
          });
        };
        update(options.getSortData)
        update(options.getFilterData);   

        this.$nextTick( () => {
          this.link(true)
          const iso = new Isotope(this.$el, options)
          this.options = options
          
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
        this.link(false)

        if ((!removed.length) && (!added.length))
          return;
                 
        this.iso.remove(removed)
        this.iso.insert(added)
        this.iso._requestUpdate()      
      },

      methods: {
        link (first) {
          const slots = this.$slots.default || []
          slots.forEach( 
            (slot, index) => {
              const elmt = slot.elm
              if (elmt)
                elmt.__underlying_element= { vm : this.list[index], index }     
          })
        },

        sort (name) {
          this.arrange({sortBy  :name})
          this.$emit("sort", name)
        },

        filter (name) {
          const filter = this.options.getFilterData[name]
          this.arrange({filter})
          this.$emit("filter", name)
        },

        unfilter () {
          this.arrange({filter: () => {return true;} })
          this.$emit("filter", null)
        },

        arrange (option){
          this.iso.arrange(option)
        },

        shuffle() {
          this.iso.shuffle()
          this.$emit("shuffle")
          this.$emit("sort", null)
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
