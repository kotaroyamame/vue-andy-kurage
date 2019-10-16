<template>
	<div class>
		<div v-if="isReady">
			<FaqClientPage :height="height" />
		</div>
	</div>
</template>

<script lang="ts">
import * as scrollUtil from "./FaqClientPage/scrollUtil";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { navigationStoreModule } from "./FaqClientPage/store/navigationStore";
import FaqClientPage from "./FaqClientPage/FaqClientPage.vue";
import ResourceList from "./FaqClientPage/columns/ResourceList.vue";
@Component({
	components: { FaqClientPage, ResourceList }
	// components: { TaggedInput, ColumnNavigation, VerticalNavigation, Breadcrumbs },
})
export default class Wrapper extends Vue {
	get sections() {
		return []; //getViewSections(this.navigationStore.state.routes);
	}
	isReady: boolean = false;
	@Prop()
	public scriptPackage: any;
	@Prop()
	eventHub: any;
	@Prop()
	height: any;
	@Watch("navigationStoreModule.routes")
	onRouteChanged() {
		this.$nextTick(() => {
			const target = document.querySelector(".active");
			if (target) {
				scrollUtil.scrollIntoViewY(target);
			}
		});
	}
	@Watch("scriptPackage")
	initDataResource() {
		console.log('scriptPackage');
		if (this.scriptPackage) {
			navigationStoreModule.setDataResource(this.scriptPackage);
			setTimeout(() => {
				this.isReady = true;
			}, 100);
		}
	}
	mounted() {
		if (this.scriptPackage) {
			navigationStoreModule.setDataResource(this.scriptPackage);
			navigationStoreModule.setEventHub(this.eventHub);
			setTimeout(() => {
				this.isReady = true;
			}, 100);
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
