var count=0;

var vm = new Vue({
	el: "#main",
	data: {
		list:[
			{name:"John", id:25}, 
			{name:"Joao", id: 7}, 
			{name:"Jean", id: 101}],
		selected:null,
		option:{
			 getSortData: {
        		id: "id",
        		name: function(itemElem){
        			return itemElem.name.toLowerCase();
        		}
      		}
		}
	},
	methods:{
		add: function(){
			this.list.push({name:'Juan', id:count++});
		},
		replace: function(){
			this.list=[{name:'Edgard', id: count++}]
		}	
	}
});
