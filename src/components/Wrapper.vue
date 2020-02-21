<template>
	<div class>
		<div v-if="isReady">
			<FaqClientPage :height="height" :column-width="columnWidth" />
		</div>
	</div>
</template>

<script lang="ts">
import * as scrollUtil from "./FaqClientPage/scrollUtil";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { navigationStoreModule } from "./FaqClientPage/store/navigationStore";
import FaqClientPage from "./FaqClientPage/FaqClientPage.vue";
import ResourceList from "./FaqClientPage/columns/ResourceList.vue";
import { DataResource } from "./FaqClientPage/dataResource";
import { getViewSections } from "./FaqClientPage/resourceNavigationUtil";
@Component({
	components: { FaqClientPage, ResourceList }
	// components: { TaggedInput, ColumnNavigation, VerticalNavigation, Breadcrumbs },
})
export default class Wrapper extends Vue {
	dataResource: DataResource = new DataResource();
	get sections() {
		return getViewSections(navigationStoreModule.Route);
	}
	isReady: boolean = false;
	@Prop()
	public scriptPackage: any;
	@Prop()
	eventHub: any;
	@Prop()
	height: any;
	@Prop({ type: Number, default: 300 })
	columnWidth: any;
	@Watch("navigationStoreModule.Routes")
	onRouteChanged() {
		this.$nextTick(() => {
			const target = document.querySelector(".vue-andy-kurage-active");
			if (target) {
				scrollUtil.scrollIntoViewY(target);
			}
		});
	}
	@Watch("scriptPackage")
	initDataResource() {
		console.log("scriptPackage");
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
		if (this.eventHub) {
			this.eventHub.$on("selectScriptItem", this.selectScriptItem);
			this.eventHub.$on("setRoutes", this.setRoutes);
			this.eventHub.$on("setIndex", this.setIndex);
		}
	}
	private selectScriptItem(id: string) {
		this.dataResource.setDataResource(this.scriptPackage);
		if (id === "#") {
			navigationStoreModule.setRoutes(this.dataResource.getTopItem());
			return;
		}
		const routes = this.dataResource.getRoutesById(id);
		navigationStoreModule.setRoutes(routes);
	}
	private setRoutes(routes: Array<any>) {
		navigationStoreModule.setRoutes(routes);
	}
	private setIndex(index: number) {
		navigationStoreModule.movePositionTo(index);
	}
	private destroyed() {
		if (this.eventHub) {
			this.eventHub.$off("selectScriptItem", this.selectScriptItem);
			this.eventHub.$off("setRoutes", this.setRoutes);
			this.eventHub.$off("setIndex", this.setIndex);
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
