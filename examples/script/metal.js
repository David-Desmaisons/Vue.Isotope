var count=0;

var vm = new Vue({
	el: "#main",
	data: {
		list:[
			{name:"Tellurium", symbol:"Te", number:52, weight: 127.6}, 
			{name:"Bismuth", symbol:"Bi", number:83, weight: 208.980}, 
			{name:"Lead", symbol:"Pb", number:82, weight: 207.2}],
		selected:null,
		option:{
			itemSelector : ".element-item"
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