(function(){
  function buildVueIsotope(_, Isotope){

    // function mix(source, functions){
    //   _.forEach(['bind', 'diff', 'unbind', 'update'],function(value){
    //       var original = source[value];
    //       source[value] = function(){  
    //         var after = functions[value].apply(this, arguments);       
    //         original.apply(this, arguments);
    //         after.apply(this, arguments);
    //       };
    //   });
    // }

    function addClass(node, classValue){
      node.data.staticClass = node.data.staticClass + " " + classValue
    }

    function getItemVm(element){
      if (!!element.__v_frag)
        return element.__v_frag.raw;

      return element.__vue__._frag.raw;
    }

    function getItemHTLM(element,id){
      return element[id].node;
    }

    const props = {
      options : Object,
       itemselector : {
        type: String,
        required: true
      }
    }

    function install (Vue) {
      var isotope ={
        props,

        render (h) {
          const slots = this.$slots.default
          slots.forEach( elt => addClass(elt, this.itemselector))
          return h('div', null, this.$slots.default)
        },

        mounted () {
          const options = _.merge(this.options.itemSelector, {itemSelector: "." + this.itemselector}) 
          var update = function (object){
            _.forOwn(object, function(value, key){
              object[key] = function (itemElement){ return value.call(ctx.vm, getItemVm(itemElement));};
            });
          };
          update(options.getSortData);
          
          const elt = this.$el
          this.$nextTick( () => {
            var iso = new Isotope(elt, options);
          })
        }
      };

      Vue.component('isotope', isotope);
    }

    var vueIsotope = {
      install
    }

    return vueIsotope;
  }

  if (typeof exports == "object") {
    var _ = require("lodash"), Isotope = require("isotope-layout");
    module.exports = buildVueIsotope(_, Isotope);
  } else if (typeof define == "function" && define.amd) {
    define(['lodash','Isotope'], function(_, Isotope){ return buildVueIsotope(_, Isotope); });
  } else if ((window.Vue) && (window._) && (window.Isotope)) {
    var vueIsotope = buildVueIsotope(window._, window.Isotope);
    Vue.use(vueIsotope);
  }
})();
