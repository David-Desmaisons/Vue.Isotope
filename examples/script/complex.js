var count=0;

var vm = new Vue({
	el: "#main",
	data: {
		list:[
			{name:"John", id:25}, 
			{name:"Joao", id: 7}, 
			{name:"Jean", id: 101}],
		selected:null,
    sortOption:{
      first:null,
      second:null
    },
    filterOption:{
      first:null,
      second:null
    },
		option1:{
			id : "first",
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
      			}
      		}
		},
		option2:{
			id : "second",
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
      	}
      }
		}
	},
	methods:{
		add: function(){
			this.list.push({name:'Juan', id:count++});
		},
		replace: function(){
			this.list=[{name:'Edgard', id: count++}, {name:'James', id:count++}]
		}
	}
});
