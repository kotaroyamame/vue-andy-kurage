# vue-andy-kurage

## Project setup
```
npm install vue-andy-kurage
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build-lib
```
![ vue-andy-kurage ]( https://iid.systems/andytools/video/vue-andy-kurage.gif )

### Example

main.js
```
import {AndyKurage} from 'vue-andy-kurage';
Vue.use(AndyKurage);
```

example.vue
```
<AndyKurage :script-package="scriptPackage"  :column-width="500" :height="'600px'" />
```

scriptPackage
```
{
	"scenario": [],
	"talk_script": {
		"body": [
			{
				"id": "34",
				"text": "title1",
				"type": "node",
				"status": "published",
				"position": 0,
				"items": {
					"scenario_id": ""
				},
				"parent": "#"
			},
			{
				"id": "35",
				"text": "title1-1",
				"type": "node",
				"status": "published",
				"position": 0,
				"items": {
					"scenario_id": ""
				},
				"parent": "34"
			},
			{
				"id": "36",
				"text": "title1-1-1",
				"type": "leaf",
				"position": 0,
				"status": "published",
				"items": {
					"scenario_id": ""
				},
				"questions": [],
				"tags": [],
				"parent": "35"
			},
			{
				"id": "39",
				"text": "title1-2",
				"type": "node",
				"status": "published",
				"position": 1,
				"items": {
					"scenario_id": ""
				},
				"parent": "34"
			},
			{
				"id": "40",
				"text": "title1-2-1",
				"type": "leaf",
				"position": 0,
				"status": "published",
				"items": {
					"scenario_id": ""
				},
				"questions": [],
				"tags": [],
				"parent": "39"
			}
		]
	},
	"synonym_dict": {},
	"inverted_index": {},
	"script_by_id": {},
	"script": []
}
```

### Event

Add param

eventHub

eventHub.ts
```
import Vue from "vue";

export const eventHub = new Vue();
```

example.vue

```
<script>
import { eventHub } from "../eventHub";
...
data: function() {
		return {
			eventHub: eventHub,
...
```

```
<template>
...
<AndyKurage :script-package="scriptPackage"  :column-width="500" :height="'600px'" :eventHub="eventHub" />
...
```
#### changeRoute

```
eventBus.$on("changeRoute", ({ routes, index }) => {

})
```

#### setScript

click item

```
eventBus.$on("setScript", item => {})
```

#### setResultScript

click result item

```
eventBus.$on("setResultScript", item => {})
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
