<template>
	<div class>
		<div v-if="isReady">
			<FaqClientPage :height="height" />
		</div>
	</div>
</template>

<script lang="ts">
// import { getViewSections } from "../resourceNavigationUtil";
import * as scrollUtil from "./scrollUtil";
import { Watch, Prop, Component, Vue } from "vue-property-decorator";
import { navigationStoreModule } from "./store/navigationStore";
import FaqClientPage from "./FaqClientPage.vue";
import ResourceList from "./columns/ResourceList.vue";
// import FaqClientPage from '@/components/FaqClientPage/index.vue';
@Component({
	components: { FaqClientPage, ResourceList }
	// components: { TaggedInput, ColumnNavigation, VerticalNavigation, Breadcrumbs },
})
export default class FaqClientPageWrapper extends Vue {
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
	mounted() {
		navigationStoreModule.setDataResource(this.scriptPackage);
		navigationStoreModule.setEventHub(this.eventHub);
		setTimeout(() => {
			this.isReady = true;
		}, 100);
	}
}
</script>

<style lang="scss">
.vue-andy-kurage-FaqClientPage {
	overflow-y: scroll;
	flex: 1;
	// border: 10px green solid;
	box-sizing: border-box;
	// display: flex;
	// flex-direction: column;
	> .vue-andy-kurage-searchBox {
		padding: 15px;
		background: #ccc;
	}
	> .vue-andy-kurage-main {
		// flex: 1;
		// display: flex;
		// flex-direction: column;
		// position: relative;
		// border: 10px blue solid;
		box-sizing: border-box;
	}
}
</style>
