(function(){
  function buildVueIsotope(_){

    function mix(source, functions){
      _.forEach(['bind', 'diff', 'unbind'],function(value){
          var original = source[value];
          var patch = functions[value];
          source[value] = function(){  
            var after = patch.apply(this, arguments);       
            original.apply(this, arguments);
            after.apply(this, arguments);
          };
      });
    }
    
    var vueIsotope = {
      install : function(Vue) {
        var forDirective = Vue.directive('for');
        var dragableForDirective = _.clone(forDirective);
        dragableForDirective.params = dragableForDirective.params.concat('options', 'root');

        function getNode(frag){
          return frag.node;
        };

        mix(dragableForDirective, {
          bind : function(){
            parent = (!!this.params.root) ? document.getElementById(this.params.root) : this.el.parentElement;

            return function () {    
             var defaultOptions={
               layoutMode: 'masonry',
               itemSelector: '.item',
               masonry: {
                 gutter: 10
               }
             };
             var ctx = this, options = this.params.options;
             options = (typeof options === "string") ? JSON.parse(options) : options;
             options = _.merge(defaultOptions, options);

             this.vm.$nextTick(function () {
               ctx._iso = new Isotope(parent, options);
             });
           };
          },
          diff : function (value){
            var old = _.map(this.frags, getNode);
            return function(){
              var iso = this._iso;
              if (!iso)
                return;
              var actual = _.map(this.frags, getNode),
                  added = _.difference(actual, old),
                  removed = _.difference(old, actual);

              this.vm.$nextTick(function(){        
                var update = (!!removed.length) || (!!added.length);             
                if (!!removed.length)
                  iso.remove(removed); 
                if (!!added.length)
                  iso.insert(added);
                if (update)
                  iso.layout();
              });
            };
          },
          unbind : function (){
            return function(){
              this._iso.destroy();
            };            
          }
        });

        Vue.directive('isotope-for', dragableForDirective);
      }
    };
    return vueIsotope;
  }

  if (typeof exports == "object") {
    var _ = require("lodash.js");
    module.exports = buildVueIsotope(_);
  } else if (typeof define == "function" && define.amd) {
    define(['lodash'], function(_){ return buildVueIsotope(_); });
  } else if ((window.Vue) && (window._)) {
    window.vueIsotope = buildVueIsotope(window._);
    Vue.use(window.vueIsotope);
  }
})();
