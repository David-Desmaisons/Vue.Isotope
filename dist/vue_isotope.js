"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
  function buildVueIsotope(Isotope) {

    function addClass(node, classValue) {
      if (!node.data || node.data.staticClass && node.data.staticClass.indexOf('ignore') !== -1) {
        return;
      }
      var initValue = !node.data.staticClass ? "" : node.data.staticClass + " ";
      node.data.staticClass = initValue + classValue;
    }

    function getItemVm(elmt) {
      return elmt.__underlying_element;
    }

    var props = {
      options: {
        type: Object,
        default: {
          layoutMode: 'masonry',
          masonry: {
            gutter: 10
          }
        }
      },
      itemSelector: {
        type: String,
        default: "item"
      },
      list: {
        type: Array,
        required: true
      }
    };

    var isotopeComponent = {
      name: 'isotope',

      props: props,

      render: function render(h) {
        var _this = this;

        var map = {};
        var prevChildren = this.prevChildren = this.children;
        var rawChildren = this.$slots.default || [];
        var children = this.children = [];
        var removedKeys = this.removedKeys = [];

        rawChildren.forEach(function (elt) {
          return addClass(elt, _this.itemSelector);
        });

        for (var i = 0; i < rawChildren.length; i++) {
          var c = rawChildren[i];
          if (c.tag) {
            if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
              children.push(c);
              map[c.key] = c;
            } else {
              var opts = c.componentOptions;
              var name = opts ? opts.Ctor.options.name || opts.tag || '' : c.tag;
              console.log("Warning template error: isotope children must be keyed: <" + name + ">");
            }
          }
        }

        var displayChildren = this.displayChildren = [].concat(children);

        if (prevChildren) {
          for (var _i = 0; _i < prevChildren.length; _i++) {
            var _c = prevChildren[_i];
            if (!map[_c.key]) {
              displayChildren.splice(_i, 0, _c);
              removedKeys.push(_c.key);
            }
          }
        }

        return h('div', null, displayChildren);
      },
      mounted: function mounted() {
        var _this2 = this;

        var options = Object.assign({}, this.compiledOptions);
        var update = function update(object) {
          Object.entries(object).forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];

            object[key] = function (itemElement) {
              var res = getItemVm(itemElement); return value.call(_this2, res.vm, res.index);
            };
          });
        };
        update(options.getSortData || {});
        update(options.getFilterData || {});
        this._isotopeOptions = options;
        if (options.filter) {
          options.filter = this.buildFilterFunction(options.filter);
        }

        this.$nextTick(function () {
          _this2.link();
          _this2.listen();
          var iso = new Isotope(_this2.$el, options);

          iso._requestUpdate = function () {
            if (iso._willUpdate) return;

            iso._willUpdate = true;
            _this2.$nextTick(function () {
              iso.arrange();
              iso._willUpdate = false;
            });
          };
          _this2.iso = iso;
        });
      },
      beforeDestroy: function beforeDestroy() {
        this._listeners.forEach(function (unlisten) {
          unlisten();
        });
        if (this._filterlistener) {
          this._filterlistener();
        }
        this.iso = null;
      },
      beforeUpdate: function beforeUpdate() {
        this._oldChidren = Array.prototype.slice.call(this.$el.children);
      },
      updated: function updated() {
        var _this3 = this;

        if (!this.iso) {
          return;
        }

        var newChildren = [].concat(_toConsumableArray(this.$el.children));
        var added = newChildren.filter(function (c) {
          return !(_this3._oldChidren.indexOf(c) !== -1);
        });
        var removed = this.removedKeys.map(function (key) {
          return Array.from(_this3.$el.children).find(function (c) {
            return c.__vue__ && c.__vue__.$vnode.key === key;
          });
        });

        this.cleanupNodes();
        this.link();

        if (!removed.length && !added.length) return;

        this.listen();

        this.iso.remove(removed);
        this.iso.insert(added);
        this.iso._requestUpdate();
      },


      methods: {
        cleanupNodes: function cleanupNodes() {
          var _this4 = this;

          this.removedKeys.reverse();
          this._vnode.children = this._vnode.children.filter(function (c) {
            return !(_this4.removedKeys.indexOf(c.key) !== -1);
          });
          this.$children = this.$children.filter(function (c) {
            return !(_this4.removedKeys.indexOf(c.$vnode.key) !== -1);
          });
        },
        link: function link() {
          var _this5 = this;

          var slots = this.$slots.default || [];
          slots.filter(function (slot) {
            return slot.data && slot.data.staticClass && !(slot.data.staticClass.indexOf('ignore') !== -1);
          }).forEach(function (slot, index) {
            var elmt = slot.elm;
            if (elmt) elmt.__underlying_element = { vm: _this5.list[index], index: index };
          });
        },
        listen: function listen() {
          var _this6 = this;

          this._listeners = Object.values(this.compiledOptions.getSortData || {}).map(function (sort) {
            return Array.from(_this6.$el.children).map(function (collectionElement, index) {
              return _this6.$watch(function () {
                return sort(collectionElement);
              }, function () {
                _this6.iso.updateSortData();
                // this.iso._requestUpdate();
              });
            });
          }).flat();
        },
        sort: function sort(name) {
          var sort = name;
          if (typeof name === "string") {
            sort = { sortBy: name };
          }
          this.arrange(sort);
          this.$emit("sort", name);
        },
        buildFilterFunction: function buildFilterFunction(name) {
          var filter = this._isotopeOptions.getFilterData[name];
          return filter;
        },
        filter: function filter(name) {
          var filter = this.buildFilterFunction(name);
          this.arrange({ filter: filter });
          this.$emit("filter", name);
        },
        unfilter: function unfilter() {
          this.arrange({
            filter: function filter() {
              return true;
            }
          });
          this.$emit("filter", null);
        },
        layout: function layout(name) {
          var layout = name;
          if (typeof name === "string") {
            layout = { layoutMode: name };
          }
          this.arrange(layout);
          this.$emit("layout", layout);
        },
        arrange: function arrange(option) {
          this.iso.arrange(option);
          this.$emit("arrange", option);
        },
        shuffle: function shuffle() {
          this.iso.shuffle();
          this.$emit("shuffle");
          this.$emit("sort", null);
        },
        getFilteredItemElements: function getFilteredItemElements() {
          return this.iso.getFilteredItemElements();
        },
        getElementItems: function getElementItems() {
          return this.iso.getElementItems();
        }
      },

      computed: {
        compiledOptions: function compiledOptions() {
          var options = Object.assign({}, this.options, { itemSelector: "." + this.itemSelector, isJQueryFiltering: false });

          Object.entries(options.getSortData || {}).forEach(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
              key = _ref4[0],
              value = _ref4[1];

            if (typeof value === "string") {
              options.getSortData[key] = function (itemElement) {
                return itemElement[value];
              };
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
    define(['Isotope'], function (Isotope) {
      return buildVueIsotope(Isotope);
    });
  } else if (window.Vue && window.Isotope) {
    var isotope = buildVueIsotope(window.Isotope);
    Vue.component('isotope', isotope);
  }
})();