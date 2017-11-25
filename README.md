# Vue.Isotope
[![GitHub open issues](https://img.shields.io/github/issues/David-Desmaisons/Vue.Isotope.svg?maxAge=2592000)](https://github.com/David-Desmaisons/Vue.Isotope/issues)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/David-Desmaisons/Vue.Isotope.svg?maxAge=2592000)](https://github.com/David-Desmaisons/Vue.Isotope/issues)
[![Npm download](https://img.shields.io/npm/dt/vueisotope.svg?maxAge=2592000)](https://www.npmjs.com/package/vueisotope)
[![Npm version](https://img.shields.io/npm/v/vueisotope.svg?maxAge=2592000)](https://www.npmjs.com/package/vueisotope)
[![Package Quality](http://npm.packagequality.com/shield/vueisotope.svg)](http://packagequality.com/#?package=vueisotope)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)
[![MIT License](https://img.shields.io/github/license/David-Desmaisons/Vue.Isotope.svg)](https://github.com/David-Desmaisons/Vue.Isotope/blob/master/LICENSE)

Vue component (Vue.js 2.0) or directive (Vue.js 1.0) allowing [isotope layout](http://isotope.metafizzy.co/) including filtering and sorting.


## Motivation

Integrate Vue with isotope filter & sort magical layouts. 

## Demo

![demo gif](https://raw.githubusercontent.com/David-Desmaisons/Vue.Isotope/master/example1.gif)

[Basic](https://jsfiddle.net/dede89/rz7q746y/)<br>
[Complete](https://jsfiddle.net/dede89/g6c0vzm2/)<br>


Isotope elements:

![demo gif](https://raw.githubusercontent.com/David-Desmaisons/Vue.Isotope/master/example2.gif)

[fiddle](https://jsfiddle.net/dede89/1a32bzm5/)<br>


## Features

* Full support of [Isotope](http://isotope.metafizzy.co/) options via options parameters
* Reactivity: component react in case in case of property impacting sorting or filtering
* Provides filter and sort based on ViewModel information

## Usage
### For Vue.js 2.0

Use isotope component:

``` html
<isotope :options='getOptions()' :list="list" @filter="filterOption=arguments[0]" @sort="sortOption=arguments[0]">
  <div v-for="element in list" :key="element.id">
    {{element.name}}
  </div>
</isotope>
```

Important: elements inside the `v-for` loop should have a `key` prop set.

#### Props
##### itemSelector
Type: `String`<br>
Required: `false`<br>
Default: `"item"`<br>

Class to be applied to the isotope elements. Similar as isotope itemSelector but without the starting "." This class will be applied automatically by the isotope component on the children elements.

##### list
Type: `Array`<br>
Required: `true`<br>

Array to be synchronized with drag-and-drop. Typically same array as referenced by inner element v-for directive.<br>

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
Send when filter, sort and layout respectively are called on the isotope element with the corresponding `String` parameter.

`shuffle`<br>
Send when shuffle is called on the isotope element.

`arrange`<br>
Send when arrange is called on the isotope element with the corresponding `Object` parameter.

#### Methods
`sort (name)`<br>
Sort the isotope component with the corresponding `String` parameter.

`filter (name)`<br>
Sort the isotope component with the corresponding `String` parameter.

`layout (option)`<br>
Change the layout of the isotope component using the option as layout name if option is `String` or with option object if option is `Object`.

`arrange (option)`<br>
Call arrange on the isotope component with the corresponding `Object` parameter.

`unfilter ()`<br>
Reset filter on the isotope component.

`shuffle ()`<br>
Shuffle the isotope component.

### Working with images 

Unloaded images can throw off Isotope layouts and cause item elements to overlap. Use [vue.imagesLoaded](https://github.com/David-Desmaisons/Vue.ImagesLoaded#isotope-example) to solve this problem.

### Gotchas

* Elements inside the `v-for` loop should have a `key` prop set otherwise they will not be rendered.

* Using Webpack or Browersify requires extra configuration, see [here](#webpack-and-browserify-usage)

### For Vue.js 1.0

[See here](documentation/Doc.vue.1.md)

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
  import isotope from 'vueisotope'
  ...
  export default {
        components: {
          isotope,
        }
        ...

  // ES5
  var isotope = require('vueisotope')
  ```
- #### For `<script>` Include

  Just include `vue.isotope.js` after Vue and lodash(>=4).
  
- #### Webpack and Browserify usage:
  Be aware of isotope recommendation for usage with [Webpack](http://isotope.metafizzy.co/extras.html#webpack) and [Browserify](http://isotope.metafizzy.co/extras.html#browserify)
  
## License
  
  [MIT](https://github.com/David-Desmaisons/Vue.isotope/blob/master/LICENSE)
