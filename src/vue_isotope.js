(function(){
  function buildVueIsotope(_, Isotope){

    function mix(source, functions){
      _.forEach(['bind', 'diff', 'unbind', 'update'],function(value){
          var original = source[value];
          source[value] = function(){  
            var after = functions[value].apply(this, arguments);       
            original.apply(this, arguments);
            after.apply(this, arguments);
          };
      });
    }

    function getItemVm(element){
      return element.__v_frag.raw;
    }

    function getItemHTLM(element,id){
      return element[id].node;
    }

    var isotopeInstances={named:{}, default:null};

    function getIso(id){
      return _.isUndefined(id) ? isotopeInstances.default : isotopeInstances.named[id];
    }

    function setIso(id, value){
      if (id){
        isotopeInstances.named[id]=value;
      }
      else{
        isotopeInstances.default = value;
      }
    }

    var vueIsotope = {
      install : function(Vue) {
        var forDirective = Vue.directive('for');
        var dragableForDirective = _.clone(forDirective);
        dragableForDirective.params = dragableForDirective.params.concat('options', 'root');

        mix(dragableForDirective, {
          bind : function(){
            var parent = (!!this.params.root) ? document.getElementById(this.params.root) : this.el.parentElement;
            var rawOptions = this.params.options;
            var originalOptions = _.isString(rawOptions) ? JSON.parse(rawOptions) : rawOptions;
            var itemClass = ((!!originalOptions) ? originalOptions.itemSelector : undefined) || ".item";
            this.el.className += itemClass.replace('.',' ');

            return function () {    
              var defaultOptions={
               layoutMode: 'masonry',
               masonry: {
                 gutter: 10
               }
              };
              var ctx = this;
              var options = _.defaults(originalOptions, defaultOptions);
              if (originalOptions){
                var isotopeSortOptions = originalOptions.getSortData;
                _.forOwn(isotopeSortOptions, function(value, key){
                  if (_.isString(value))
                    isotopeSortOptions[key] = function (itemElement){return itemElement[value];};
                });

                this.isotopeSortOptions = _.clone(isotopeSortOptions);
                this.isotopeFilterOptions = _.clone(originalOptions.getFilterData);

                var update = function (object){
                  _.forOwn(object, function(value, key){
                    object[key] = function (itemElement){ return value(getItemVm(itemElement));};
                  });
                };

                update(options.getSortData);
                update(options.getFilterData);
              }

              options.itemSelector = itemClass;

              this.vm.$nextTick(function () {
                var iso = new Isotope(parent, options);
                iso._requestUpdate= function(){
                  if (!!iso._willUpdate)
                    return;

                  iso._willUpdate=true;
                  var callingContext=this;
                  ctx.vm.$nextTick(function(){
                    callingContext.arrange();
                    callingContext._willUpdate=false;
                  });
                };
                ctx._iso = iso;
                var optionId = (!!options) ? options.id: undefined;
                setIso(optionId, iso);
                _.assign(ctx.vm,{
                  isotopeSort : function(sortOption, id){
                    getIso(id).arrange({sortBy  :sortOption});
                  },
                  isotopeFilter : function(filterOption, id){
                    if (!!ctx._filterlistener)
                      ctx._filterlistener();
                    var filter;
                    if (!!filterOption ){
                      filter = options.getFilterData[filterOption];
                      var filterFunction = ctx.isotopeFilterOptions[filterOption];
                      ctx._filterlistener = ctx.vm.$watch(function(){return _.map(ctx._value, filterFunction);},function(){
                        ctx._iso._requestUpdate();
                      });
                    }
                    else {
                      filter = function(){return true;};
                      ctx._filterlistener = null;
                    }
                    getIso(id).arrange({filter :filter});
                  },
                  isotopeShuttle: function(id){
                    getIso(id).shuffle();
                  },
                  isotopeArrange: function(id){
                    getIso(id).arrange(arguments);
                  }
                });
              });
            };
          },
          update : function (value){
            this._value=value;
            _.forEach(this._listeners, function(unlisten){unlisten();});
            return function(){
              var vm = this.vm, ctx=this;
              this.vm.$nextTick(function () {
                ctx._listeners = _(ctx.isotopeSortOptions).map(function(sort){
                  return _.map(value, function(collectionElement){
                    return vm.$watch(function(){return sort(collectionElement);},function(){
                      ctx._iso.updateSortData(getItemHTLM(collectionElement, ctx.id));
                      ctx._iso._requestUpdate();
                    });
                  });  
                }).flatten().value();
              });
            };
          },
          diff : function (){        
            function getNode(frag){
              return frag.node;
            }
            var old = _.map(this.frags, getNode);
            return function(){
              var iso = this._iso;
              if (!iso)
                return;
              var actual = _.map(this.frags, getNode),
                  added = _.difference(actual, old),
                  removed = _.difference(old, actual);

              if ((!!removed.length) || (!!added.length))
                this.vm.$nextTick(function(){                   
                  iso.remove(removed); 
                  iso.insert(added);
                  iso._requestUpdate();
                });
            };
          },
          unbind : function (){
            return function(){
              _.forEach(this._listeners, function(unlisten){unlisten();});
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
    var _ = require("lodash"), Isotope = require("isotope-layout");
    module.exports = buildVueIsotope(_, Isotope);
  } else if (typeof define == "function" && define.amd) {
    define(['lodash','Isotope'], function(_, Isotope){ return buildVueIsotope(_, Isotope); });
  } else if ((window.Vue) && (window._) && (window.Isotope)) {
    window.vueIsotope = buildVueIsotope(window._, window.Isotope);
    Vue.use(window.vueIsotope);
  }
})();
