var count=0;

var vm = new Vue({
	el: "#main",
	data: {
		list:[
			{name:"John", id:25}, 
			{name:"Joao", id: 7},
			{name:"Albert", id: 12}, 
			{name:"Jean", id: 100}],
		selected: null,
		sortOption:null,
		filterOption:null,
		filterText: ""
	},
	methods:{
		getOptions: function () {
			var _this = this
			return {
				layoutMode: 'masonry',
	          	masonry: {
	            	gutter: 10
	          	},
				getSortData: {
	        		id: "id",
	        		name: function(itemElem){
	        			return itemElem.name.toLowerCase();     
	        		}
	        	},
	      		getFilterData:{
	      			isEven: function(itemElem){
	      				return itemElem.id % 2 === 0;
	      			},
	      			isOdd: function(itemElem){
	      				return itemElem.id % 2 !== 0;
	      			},
	      			filterByText: function(itemElem){
	        			return itemElem.name.toLowerCase().includes(_this.filterText.toLowerCase());
	        		}
	      		}
	      	}
		},
		add: function () {
			this.list.push({name:'Juan', id:count++});
		},
		replace: function(){
			this.list=[{name:'Edgard', id: count++}, {name:'James', id:count++}]
		},
		remove: function(){
			if (this.list.length)
				this.list.splice(0, 1)
		}
	}
});
