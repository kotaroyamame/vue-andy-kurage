<template>
	<div class="vue-andy-kurage-FaqClientPage vue-andy-kurage-scrollY">
		<!-- <div class="searchBox">
      <TaggedInput
        :navigationStore="navigationStore"
      />
		</div>-->
		<div class="vue-andy-kurage-main">
			<ColumnNavigation :style="Style" :column-width="columnWidth" :height="height" />
			<!-- <div>scenario:</div> -->
			<!-- <VerticalNavigation v-if="sections.scenario" :range="sections.scenario" />
			{{sections.scenario}}
			<div>result:</div> -->
			<!-- <VerticalNavigation v-if="sections.result" :range="sections.result" /> -->
			<!-- <div style="height: 1024px">dammy</div> -->
		</div>
	</div>
</template>

<script lang="ts">
// import FaqClientMixin from '../mixins/FaqClientMixin';
import { getViewSections } from "./resourceNavigationUtil";
import * as scrollUtil from "./scrollUtil";
import ColumnNavigation from "./ColumnNavigation.vue";
import VerticalNavigation from "./VerticalNavigation.vue";
import { Watch } from "vue-property-decorator";
import { Component, Vue, Prop } from "vue-property-decorator";
import { navigationStoreModule } from "./store/navigationStore";
@Component({
	components: { ColumnNavigation, VerticalNavigation }
})
export default class FaqClientPage extends Vue {
	@Prop()
	height: any;
	@Prop()
	columnWidth:any;
	get Style() {
		return {
			height: this.height || "400px"
		};
	}
	get sections() {
		return getViewSections(navigationStoreModule.Routes);
	}
	@Watch("navigationStoreModule.Routes")
	onRouteChanged() {
		this.$nextTick(() => {
			const target = document.querySelector(".vue-andy-kurage-active");
			if (target) {
				scrollUtil.scrollIntoViewY(target);
			}
		});
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
