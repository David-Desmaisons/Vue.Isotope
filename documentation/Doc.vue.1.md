
### For Vue.js 1.0

Use it exactly as v-for directive, passing optional parameters using 'options' parameter.
The isotope elements should be wrapped inside a div root element

  ``` html
  <div>
    <div v-isotope-for="element in list1">
      <p>{{element.name}}</p>
    </div>
  </div>
   ```

#### Demo

![demo gif](https://raw.githubusercontent.com/David-Desmaisons/Vue.Isotope/master/example1.gif)

[Basic](https://jsfiddle.net/dede89/zc1x0vdd/)<br>
[Complete](https://jsfiddle.net/dede89/g6c0vzm2/)<br>

![demo gif](https://raw.githubusercontent.com/David-Desmaisons/Vue.Isotope/master/example2.gif)

[fiddle](https://jsfiddle.net/dede89/d117mj5u/)

#### API:
##### Options
* All value are similar as isotope options expect for:
* id value: the unique name of the isotope component
* Filter definition:
  Implement filter by passing an option with a getFilterData object that exposes filter option. Vue.Isotope will call these 
  functions with the element to filter as parameter and this set as the underlying vm.
  
      		getFilterData:{
      			isEven: function(itemElem){
      				return itemElem.id % 2 === 0;
      			},
      			isOdd: function(itemElem){
      				return itemElem.id % 2 !== 0;
      			},
      			filterByText: function(itemElem){
        			return itemElem.name.toLowerCase().includes(this.filterText.toLowerCase());
        		}
        	}
        	
  
* Sort definition:
  Implement sort by passing as option a getSortData object that exposes filter option. Vue.Isotope will call these 
  functions with the element to filter as parameter and this set as the underlying vm. If a string is passed instead of a function, sorting
  will use the corresponding property.
  
  			getSortData: {
        		id: "id",
        		name: function(itemElem){
        			return itemElem.name.toLowerCase();     
        		}
        	}
        	
### Filtering and sorting:
  To filter or sort call isotopeSort or isotopeFilter on the VierwModel (Vue.Isotope will add this function to the ViewModel).
  These functions call two arguments: option and id. The first is the sorting or filtering key as defined in getSortData or 
  getFilterData respectivelly. The second is the id of the underlying isotope component defined as the "id" property of the
  option arguments. If only one isotope component is displayed this value can be omitted.
  
      this.isotopeFilter(key, id);
      
  Another useful method is isotopeShutle(id) to display a random order.
  
      this.isotopeShuttle(id);

### Toogle Layout
  Similarly, it is possible to update the layout mode using the following method: 
  
      this.isotopeArrange(arrangeOption, id);
      
  where arrangeOption is the same as described in isotope documentation and the id the same as described in filtering and sorting section as this method will call isope arrange method.
  
  Alternatively, you can use isotopeLayout method: 
  
    this.isotopeLayout(id);
    
  that will internally call isotope layout method.

## Installation
- Available through:
``` js
 npm install vueisotope
```
``` js
 Bower install vueisotope
```
- #### For Modules

  ``` js
  // ES6  
  //For Vue.js 1.0 only
  import Vue from 'vue'
  import Vueisotope from 'vueisotope'
  Vue.use(Vueisotope)

  // ES5
  var Vue = require('vue')
  Vue.use(require('vueisotope'))
  ```
- #### For `<script>` Include

  Just include `vue.istope.js` after Vue and lodash(>=4).
  
- #### Webpack and Browserify usage:
  Be aware of isotope recomendation for usage with [Webpack](http://isotope.metafizzy.co/extras.html#webpack) and [Browserify](http://isotope.metafizzy.co/extras.html#browserify)