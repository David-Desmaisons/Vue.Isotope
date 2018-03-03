"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
  function buildVueIsotope(_, Isotope) {

    function addClass(node, classValue) {
      if (node.data) {
        var initValue = !node.data.staticClass ? "" : node.data.staticClass + " ";
        node.data.staticClass = initValue + classValue;
      }
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
        var removedIndex = this.removedIndex = [];

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
              removedIndex.push(_i);
            }
          }
        }

        return h('div', null, displayChildren);
      },
      mounted: function mounted() {
        var _this2 = this;

        var options = _.merge({}, this.compiledOptions);
        var update = function update(object) {
          _.forOwn(object, function (value, key) {
            object[key] = function (itemElement) {
              var res = getItemVm(itemElement);return value.call(_this2, res.vm, res.index);
            };
          });
        };
        update(options.getSortData);
        update(options.getFilterData);
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
        _.forEach(this._listeners, function (unlisten) {
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
        var added = _.difference(newChildren, this._oldChidren);
        var removed = this.removedIndex.map(function (index) {
          return _this3.$el.children[index];
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

          this.removedIndex.reverse();
          this.removedIndex.forEach(function (index) {
            return _this4._vnode.children.splice(index, 1);
          });
        },
        link: function link() {
          var _this5 = this;

          var slots = this.$slots.default || [];
          slots.forEach(function (slot, index) {
            var elmt = slot.elm;
            if (elmt) elmt.__underlying_element = { vm: _this5.list[index], index: index };
          });
        },
        listen: function listen() {
          var _this6 = this;

          this._listeners = _(this.compiledOptions.getSortData).map(function (sort) {
            return _.map(_this6.list, function (collectionElement, index) {
              return _this6.$watch(function () {
                return sort(collectionElement);
              }, function () {
                _this6.iso.updateSortData();
                _this6.iso._requestUpdate();
              });
            });
          }).flatten().value();
        },
        sort: function sort(name) {
          var sort = name;
          if (_.isString(name)) {
            sort = { sortBy: name };
          }
          this.arrange(sort);
          this.$emit("sort", name);
        },
        buildFilterFunction: function buildFilterFunction(name) {
          var _this7 = this;

          var filter = this._isotopeOptions.getFilterData[name];
          this._filterlistener = this.$watch(function () {
            return _.map(_this7.list, function (el, index) {
              return _this7.options.getFilterData[name](el, index);
            });
          }, function () {
            _this7.iso._requestUpdate();
          });
          return filter;
        },
        filter: function filter(name) {
          var filter = this.buildFilterFunction(name);
          this.arrange({ filter: filter });
          this.$emit("filter", name);
        },
        unfilter: function unfilter() {
          this.arrange({ filter: function filter() {
              return true;
            } });
          this.$emit("filter", null);
        },
        layout: function layout(name) {
          var layout = name;
          if (_.isString(name)) {
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
          var options = _.merge({}, this.options, { itemSelector: "." + this.itemSelector, isJQueryFiltering: false });

          _.forOwn(options.getSortData, function (value, key) {
            if (_.isString(value)) options.getSortData[key] = function (itemElement) {
              return itemElement[value];
            };
          });

          return options;
        }
      }
    };

    return isotopeComponent;
  }

  if (typeof exports == "object") {
    var _ = require("lodash"),
        Isotope = require("isotope-layout");
    module.exports = buildVueIsotope(_, Isotope);
  } else if (typeof define == "function" && define.amd) {
    define(['lodash', 'Isotope'], function (_, Isotope) {
      return buildVueIsotope(_, Isotope);
    });
  } else if (window.Vue && window._ && window.Isotope) {
    var isotope = buildVueIsotope(window._, window.Isotope);
    Vue.component('isotope', isotope);
  }
})();