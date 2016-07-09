var count=0;

var vm = new Vue({
	el: "#main",
	data: {
		list:[{ 
				name: "Mercury", 
				symbol: "Hg", 
				number: 80, 
				weight: 200.59,
				category: "transition",
				metal: true
			},
			{ 
				name: "Tellurium", 
				symbol: "Te", 
				number: 52, 
				weight: 127.6,
				category: "metalloid"
			}, 
			{ 
				name: "Bismuth", 
				symbol: "Bi", 
				number: 83,
				weight: 208.980,
				category: "post-transition",
				metal: true
			}, 
			{ 
				name: "Lead", 
				symbol: "Pb", 
				number: 82, 
				weight: 207.2,
				category: "post-transition",
				metal: true
			},
			{ 
				name: "Gold", 
				symbol: "Au", 
				number: 79, 
				weight: 196.967,
				category: "transition",
				metal: true
			},
			{ 
				name: "Potassium", 
				symbol: "K", 
				number: 19, 
				weight: 39.0983,
				category: "alkali"
			},
			{ 
				name: "Sodium", 
				symbol: "Na", 
				number: 11, 
				weight: 22.99,
				category: "alkali"
			}],
		selected: null,
		sortOption: "original-order",
		filterOption: "show all",
		option:{
			itemSelector : ".element-item",
			getFilterData: {
			    "show all": function(){return true;},
			    metal: function(el){return !!el.metal;},
			    transition: function(el){return el.category==="transition";},
			    "not transition": function(el){return el.category!=="transition";},
				"alkali and alkaline-earth": function(el){return el.category==="alkali";},
				"number > 50": function(el) {
    				return el.number > 50;
  				},
  				"name ends with ium": function(el) {
    				return el.name.match( /ium$/ );
  				}
			},
			getSortData: {
			    name: "name",
			    symbol: "symbol",
			    number: "number", 
				weight: "weight",
				category: "category"
			}
		}
	},
	methods:{
		sort : function(key){
			this.isotopeSort(key);
			this.sortOption=key;
		},
		filter : function(key){
			this.isotopeFilter(key);
			this.filterOption=key;
		}	
	}
});