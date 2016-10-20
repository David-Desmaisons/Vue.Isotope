"use strict";

(function () {
  function buildVueIsotope(_, Isotope) {

    function addClass(node, classValue) {
      var initValue = node.data.staticClass === undefined ? "" : node.data.staticClass + " ";
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
    };

    var isotopeComponent = {
      props: props,

      render: function render(h) {
        var _this = this;

        var slots = this.$slots.default || [];
        slots.forEach(function (elt) {
          return addClass(elt, _this.itemSelector);
        });
        return h('div', null, slots);
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

        this.$nextTick(function () {
          _this2._isotopeOptions = options;
          _this2.link(true);
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
      beforedestroy: function beforedestroy() {
        this.iso.destroy();
        _.forEach(this._listeners, function (unlisten) {
          unlisten();
        });
        if (this._filterlistener) this._filterlistener();
      },
      beforeUpdate: function beforeUpdate() {
        this._oldChidren = Array.prototype.slice.call(this.$el.children);
      },
      updated: function updated() {
        var newChildren = Array.prototype.slice.call(this.$el.children);
        var added = _.difference(newChildren, this._oldChidren);
        var removed = _.difference(this._oldChidren, newChildren);
        this.link(false);

        if (!removed.length && !added.length) return;

        this.listen();

        this.iso.remove(removed);
        this.iso.insert(added);
        this.iso._requestUpdate();
      },


      methods: {
        link: function link(first) {
          var _this3 = this;

          var slots = this.$slots.default || [];
          slots.forEach(function (slot, index) {
            var elmt = slot.elm;
            if (elmt) elmt.__underlying_element = { vm: _this3.list[index], index: index };
          });
        },
        listen: function listen() {
          var _this4 = this;

          this._listeners = _(this.compiledOptions.getSortData).map(function (sort) {
            return _.map(_this4.list, function (collectionElement, index) {
              return _this4.$watch(function () {
                return sort(collectionElement);
              }, function () {
                _this4.iso.updateSortData();
                _this4.iso._requestUpdate();
              });
            });
          }).flatten().value();
        },
        sort: function sort(name) {
          this.arrange({ sortBy: name });
          this.$emit("sort", name);
        },
        filter: function filter(name) {
          var _this5 = this;

          var filter = this._isotopeOptions.getFilterData[name];
          this._filterlistener = this.$watch(function () {
            return _.map(_this5.list, function (el, index) {
              return _this5.options.getFilterData[name](el, index);
            });
          }, function () {
            _this5.iso._requestUpdate();
          });
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
          this.arrange({ layoutMode: name });
          this.$emit("layout", name);
        },
        arrange: function arrange(option) {
          this.iso.arrange(option);
          this.$emit("arrange", option);
        },
        shuffle: function shuffle() {
          this.iso.shuffle();
          this.$emit("shuffle");
          this.$emit("sort", null);
        }
      },

      computed: {
        compiledOptions: function compiledOptions() {
          var options = _.merge({}, this.options, { itemSelector: "." + this.itemSelector });

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