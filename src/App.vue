<template>
	<div id="app">
		<img alt="Vue logo" src="./assets/logo.png" />
		<div v-if="isReady">
			<AndyKurage :script-package="scriptPackage" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import HelloWorld from './components/HelloWorld.vue';
import AndyKurage from "./components/Wrapper.vue";

@Component({
	components: {
		AndyKurage
	}
})
export default class App extends Vue {
	scriptPackage: any;
	isReady: boolean = false;
	private async created() {
		const response = await fetch(
			`./script_package.json?${new Date().getTime()}`
		);
		const data = await response.json();
		this.scriptPackage = data;
		this.isReady = true;
	}
}
</script>

<style lang="scss">
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
