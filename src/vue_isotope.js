(function () {
  function buildVueIsotope(Isotope) {

    function addClass(node, classValue) {
      if (!node.data || (node.data.staticClass && node.data.staticClass.includes('ignore'))) {
        return
      }
      const initValue = (!node.data.staticClass) ? "" : node.data.staticClass + " "
      node.data.staticClass = initValue + classValue
    }

    function getItemVm(elmt) {
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

    var isotopeComponent = {
      name: 'isotope',

      props,

      render(h) {
        const map = {}
        const prevChildren = this.prevChildren = this.children
        const rawChildren = this.$slots.default || []
        const children = this.children = []
        const removedKeys = this.removedKeys = []

        rawChildren.forEach(elt => addClass(elt, this.itemSelector))

        for (let i = 0; i < rawChildren.length; i++) {
          const c = rawChildren[i]
          if (c.tag) {
            if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
              children.push(c)
              map[c.key] = c
            } else {
              const opts = c.componentOptions
              const name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag
              console.log(`Warning template error: isotope children must be keyed: <${name}>`)
            }
          }
        }

        const displayChildren = this.displayChildren = [...children]

        if (prevChildren) {
          for (let i = 0; i < prevChildren.length; i++) {
            const c = prevChildren[i]
            if (!map[c.key]) {
              displayChildren.splice(i, 0, c)
              removedKeys.push(c.key)
            }
          }
        }

        return h('div', null, displayChildren)
      },

      mounted() {
        const options = Object.assign({}, this.compiledOptions);
        var update = (object) => {
          Object.entries(object).forEach(([key, value]) => {
            object[key] = (itemElement) => { const res = getItemVm(itemElement); return value.call(this, res.vm, res.index); };
          });
        };
        update(options.getSortData || {});
        update(options.getFilterData || {});
        this._isotopeOptions = options
        if (options.filter) {
          options.filter = this.buildFilterFunction(options.filter)
        }

        this.$nextTick(() => {
          this.link()
          this.listen()
          const iso = new Isotope(this.$el, options)

          iso._requestUpdate = () => {
            if (iso._willUpdate)
              return

            iso._willUpdate = true
            this.$nextTick(() => {
              iso.arrange()
              iso._willUpdate = false
            });
          };
          this.iso = iso
        })
      },

      beforeDestroy() {
        this._listeners.forEach((unlisten) => { unlisten(); });
        if (this._filterlistener) {
          this._filterlistener();
        }
        this.iso = null
      },

      beforeUpdate() {
        this._oldChidren = Array.prototype.slice.call(this.$el.children)
      },

      updated() {
        if (!this.iso) {
          return;
        }

        const newChildren = [...this.$el.children]
        const added = newChildren.filter(c => !this._oldChidren.includes(c));
        const removed = this.removedKeys.map(key => Array.from(this.$el.children).find(c => c.__vue__ && c.__vue__.$vnode.key === key));

        this.cleanupNodes()
        this.link()

        if ((!removed.length) && (!added.length))
          return;

        this.listen()

        this.iso.remove(removed)
        this.iso.insert(added)
        this.iso._requestUpdate()
      },

      methods: {
        cleanupNodes() {
          this.removedKeys.reverse();
          this._vnode.children = this._vnode.children.filter(c => !this.removedKeys.includes(c.key));
          this.$children = this.$children.filter(c => !this.removedKeys.includes(c.$vnode.key));
        },

        link() {
          const slots = this.$slots.default || []
          slots.filter((slot) => slot.data && slot.data.staticClass && !slot.data.staticClass.includes('ignore'))
            .forEach(
              (slot, index) => {
                const elmt = slot.elm
                if (elmt)
                  elmt.__underlying_element = { vm: this.list[index], index }
              })
        },

        listen() {
          this._listeners = Object.values(this.compiledOptions.getSortData || {}).map((sort) => {
            return Array.from(this.$el.children).map((collectionElement, index) => {
              return this.$watch(() => { return sort(collectionElement); }, () => {
                this.iso.updateSortData();
                // this.iso._requestUpdate();
              });
            });
          }).flat();
        },

        sort(name) {
          let sort = name
          if (typeof name === "string") {
            sort = { sortBy: name };
          }
          this.arrange(sort)
          this.$emit("sort", name)
        },

        buildFilterFunction(name) {
          const filter = this._isotopeOptions.getFilterData[name]
          return filter
        },

        filter(name) {
          const filter = this.buildFilterFunction(name)
          this.arrange({ filter })
          this.$emit("filter", name)
        },

        unfilter() {
          this.arrange({ filter: () => { return true; } })
          this.$emit("filter", null)
        },

        layout(name) {
          let layout = name
          if (typeof name === "string") {
            layout = { layoutMode: name };
          }
          this.arrange(layout)
          this.$emit("layout", layout)
        },

        arrange(option) {
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
        compiledOptions() {
          const options = Object.assign({}, this.options, { itemSelector: "." + this.itemSelector, isJQueryFiltering: false });

          Object.entries(options.getSortData || {}).forEach(([key, value]) => {
            if (typeof value === "string") {
              options.getSortData[key] = itemElement => itemElement[value];
            }
          });

          return options;
        }
      }
    };

    return isotopeComponent;
  }

  if (typeof exports == "object") {
    var Isotope = require("isotope-layout");
    module.exports = buildVueIsotope(Isotope);
  } else if (typeof define == "function" && define.amd) {
    define(['Isotope'], function (Isotope) { return buildVueIsotope(Isotope); });
  } else if ((window.Vue) && (window.Isotope)) {
    var isotope = buildVueIsotope(window.Isotope);
    Vue.component('isotope', isotope)
  }
})();
