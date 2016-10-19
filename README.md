# Vue.Isotope
[![GitHub open issues](https://img.shields.io/github/issues/David-Desmaisons/Vue.Isotope.svg?maxAge=2592000)](https://github.com/David-Desmaisons/Vue.Isotope/issues)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/David-Desmaisons/Vue.Isotope.svg?maxAge=2592000)](https://github.com/David-Desmaisons/Vue.Isotope/issues)
[![Npm download](https://img.shields.io/npm/dt/vueisotope.svg?maxAge=2592000)](https://www.npmjs.com/package/vueisotope)
[![Npm version](https://img.shields.io/npm/v/vueisotope.svg?maxAge=2592000)](https://www.npmjs.com/package/vueisotope)
[![Package Quality](http://npm.packagequality.com/shield/vueisotope.svg)](http://packagequality.com/#?package=vueisotope)
[![MIT License](https://img.shields.io/github/license/David-Desmaisons/Vue.Isotope.svg)](https://github.com/David-Desmaisons/Vue.Isotope/blob/master/LICENSE)

Vue component (Vue.js 2.0) or directive (Vue.js 1.0) allowing [isotope layout](http://isotope.metafizzy.co/) including filtering and sorting.


##Motivation

Integrate Vue with isotope filter & sort magical layouts. 

##Demo

![demo gif](https://raw.githubusercontent.com/David-Desmaisons/Vue.Isotope/master/example1.gif)

Basic:

https://jsfiddle.net/dede89/y6c8rpyu/

Complete:

https://jsfiddle.net/dede89/g6c0vzm2/

Isotope elements demo with vue template:

![demo gif](https://raw.githubusercontent.com/David-Desmaisons/Vue.Isotope/master/example2.gif)
https://jsfiddle.net/dede89/d117mj5u/

##Features

* Full support of [Isotope](http://isotope.metafizzy.co/) options via options parameters
* Reactivity: component react in case in case of property impacting sorting or filtering
* Provides filter and sort based on ViewModel information

##Usage
###For Vue.js 2.0

Use draggable component:

``` html
<isotope :options='getOptions()' :list="list" @filter="filterOption=arguments[0]" @sort="sortOption=arguments[0]">
  <div v-for="element in list" :key="element.id">
    {{element.name}}
  </div>
</isotope>
```

#### Props
##### itemSelector
Type: `String`<br>
Required: `false`<br>
Default: `"item"`<br>

Class to be applied to the isotope elements. Similar as isotope itemSelector but without the starting "." This class will be applied automatically by the isotope component on the children elements.

##### list
Type: `Array`<br>
Required: `true`<br>

Array to be synchronized with drag-and-drop. Typically same array as refrenced by inner element v-for directive.<br>
Note that draggabe component can be used with a list prop

##### options
Type: `Object`<br>
Required: `true`
* All value are similar as [isotope options](http://isotope.metafizzy.co/options.html) expect for:
* Filter definition:
  Implement filter by passing an option with a getFilterData object that exposes filter option. Vue.Isotope will call these 
  functions with the element to filter as parameter and this set as the underlying vm.
```javascript 
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
```      	
  
* Sort definition:
  Implement sort by passing as option a getSortData object that exposes filter option. Vue.Isotope will call these 
  functions with the element to filter as parameter and this set as the underlying vm. If a string is passed instead of a function, sorting
  will use the corresponding property.
```javascript
  getSortData: {
    id: "id",
    name: function(itemElem){
      return itemElem.name.toLowerCase();     
    }
  }
```

#### Events
`filter`, `sort`, `layout`<br>
Send when filter, sort and layout respectivelly are called on the isotope element with the corresponding `String` parameter.

`shuffle`<br>
Send when shuffle is called on the isotope element.

`arrange`<br>
Send when arrange is called on the isotope element with the corresponding `Object` parameter.

#### Methods
`sort (name)`<br>
Sort the isotope component with the corresponding `String` parameter.

`filter (name)`<br>
Sort the isotope component with the corresponding `String` parameter.

`layout (name)`<br>
Change the layout of the isotope component with the corresponding `String` parameter.

`arrange (option)`<br>
Call arrange on the isotope component with the corresponding `Object` parameter.

`unfilter ()`<br>
Reset filter on the isotope component.

`shuffle ()`<br>
Shuffle the isotope component.

###For Vue.js 1.0

Use it exactly as v-for directive, passing optional parameters using 'options' parameter.
The isotope elements should be wrapped inside a div root element

  ``` html
  <div>
    <div v-isotope-for="element in list1">
      <p>{{element.name}}</p>
    </div>
  </div>
   ```

####API:
#####Options
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
        	
###Filtering and sorting:
  To filter or sort call isotopeSort or isotopeFilter on the VierwModel (Vue.Isotope will add this function to the ViewModel).
  These functions call two arguments: option and id. The first is the sorting or filtering key as defined in getSortData or 
  getFilterData respectivelly. The second is the id of the underlying isotope component defined as the "id" property of the
  option arguments. If only one isotope component is displayed this value can be omitted.
  
      this.isotopeFilter(key, id);
      
  Another useful method is isotopeShutle(id) to display a random order.
  
      this.isotopeShuttle(id);

###Toogle Layout
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
  //For Vue.js 2.0
  import Vueisotope from 'vueisotope'
  ...
  export default {
        components: {
            vueisotope,
            ...
        }
        ...
  
  //For Vue.js 1.0 only
  import Vue from 'vue'
  import Vueisotope from 'vueisotope'
  Vue.use(Vueisotope)

  // ES5
  var Vue = require('vue')
  Vue.use(require('Vueisotope'))
  ```
- #### For `<script>` Include

  Just include `vue.istope.js` after Vue and lodash(>=4).
  
- #### Webpack and Browserify usage:
  Be aware of isotope recomendation for usage with [Webpack](http://isotope.metafizzy.co/extras.html#webpack) and [Browserify](http://isotope.metafizzy.co/extras.html#browserify)
  
## License
  
  [MIT](https://github.com/David-Desmaisons/Vue.isotope/blob/master/LICENSE)
