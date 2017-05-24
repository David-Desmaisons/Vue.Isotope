var count=0;

var vm = new Vue({
	el: "#main",
	data: {
		layouts:[
			"masonry",
			"fitRows",
			"cellsByRow",
			"vertical",
			"packery",
			"masonryHorizontal",
			"fitColumns",
			"cellsByColumn",
			"horiz"
		],
		currentLayout:"masonry",
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
				category: "alkali",
				metal: true
			},
			{ 
				name: "Sodium", 
				symbol: "Na", 
				number: 11, 
				weight: 22.99,
				category: "alkali",
				metal: true
			},
			{ 
				name: "Cadmium", 
				symbol: "Cd", 
				number: 48, 
				weight: 112.411,
				category: "transition",
				metal: true
			},
			{ 
				name: "Calcium", 
				symbol: "Ca", 
				number: 20, 
				weight: 40.078,
				category: "alkaline-earth",
				metal: true
			},
			{
				name: "Rhenium", 
				symbol: "Re", 
				number: 75, 
				weight: 186.207,
				category: "transition",
				metal: true				
			},
			{
				name: "Ytterbium", 
				symbol: "Yb", 
				number: 70, 
				weight: 173.054,
				category: "lanthanoid"
			},],
		selected: null,
		sortOption: "original-order",
		filterOption: "metal",
		option:{
			filter: 'metal',
			getFilterData: {
			    "show all": function(){
			    	return true;
			    },
			    metal: function(el){
			    	return !!el.metal;
			    },
			    transition: function(el){
			    	return el.category==="transition";
			    },				
			    "alkali and alkaline-earth": function(el){
					return el.category==="alkali" || el.category==="alkaline-earth";
				},
			    "not transition": function(el){
			    	return el.category!=="transition";
			    },

				"metal but not transition": function(el){
					return !!el.metal && el.category!=="transition";
				},
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
			},
			cellsByRow: {
			    columnWidth: 220,
			    rowHeight: 220
			},
			masonryHorizontal: {
			    rowHeight: 110
			},
			cellsByColumn: {
				columnWidth: 220,
			    rowHeight: 220
			},
			packery: {
  				gutter: 10
			}
		}
	}
});