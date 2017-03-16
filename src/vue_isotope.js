(function(){
  function buildVueIsotope(_, Isotope){

    function addClass(node, classValue){
      if(node.data){
        const initValue = (node.data.staticClass === undefined) ? "" : node.data.staticClass + " "
        node.data.staticClass = initValue + classValue
      }
    }

    function getItemVm(elmt){
      return elmt.__underlying_element
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
      itemSelector: {
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
        slots.forEach( elt => addClass(elt, this.itemSelector))
        return h('div', null, slots)
      },

      mounted () {
        const options = _.merge({}, this.compiledOptions)
        var update = (object) => {
          _.forOwn(object, (value, key) => {
            object[key] = (itemElement) => { const res =  getItemVm(itemElement); return value.call(this, res.vm, res.index);};
          });
        };
        update(options.getSortData)
        update(options.getFilterData);

        this.$nextTick( () => {
          this._isotopeOptions = options
          this.link(true)
          this.listen()
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
        })
      },

      beforeDestroy () {
        this.iso.destroy()
        _.forEach(this._listeners, (unlisten) => { unlisten();} )
        if (this._filterlistener)
          this._filterlistener()
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

        this.listen()

        if(this.iso){
          this.iso.remove(removed)
          this.iso.insert(added)
          this.iso._requestUpdate()
        }
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

        listen () {
          this._listeners = _(this.compiledOptions.getSortData).map((sort) => {
            return _.map(this.list, (collectionElement, index) => {
              return this.$watch(() => {return sort(collectionElement);}, () => {
                this.iso.updateSortData();
                this.iso._requestUpdate();
              });
            });
          }).flatten().value();
        },

        sort (name) {
          this.arrange({sortBy: name, sortAscending: this.options.sortAscending})
          this.$emit("sort", name)
        },

        filter (name) {
          const filter = this._isotopeOptions.getFilterData[name]
          this._filterlistener = this.$watch( () => { return _.map(this.list, (el, index) => this.options.getFilterData[name](el, index) );},
                                              () => { this.iso._requestUpdate();});
          this.arrange({filter})
          this.$emit("filter", name)
        },

        unfilter () {
          this.arrange({filter: () => {return true;} })
          this.$emit("filter", null)
        },

        layout (name) {
          let layout = name
          if (_.isString(name)) {
            layout = {layoutMode: name}
          }
          this.arrange(layout)
          this.$emit("layout", layout)
        },

        arrange (option){
          this.iso.arrange(option)
          this.$emit("arrange", option)
        },

        shuffle() {
          this.iso.shuffle()
          this.$emit("shuffle")
          this.$emit("sort", null)
        },

        getFilteredItemElements() {
          return this.iso.getFilteredItemElements()
        },

        getElementItems() {
          return this.iso.getElementItems()
        }
      },

      computed: {
        compiledOptions () {
          const options = _.merge({}, this.options, {itemSelector: "." + this.itemSelector, isJQueryFiltering: false})

          _.forOwn(options.getSortData, (value, key) => {
            if (_.isString(value))
              options.getSortData[key] = (itemElement) => {return itemElement[value];};
          });

          return options;
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
