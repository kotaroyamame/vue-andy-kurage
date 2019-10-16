<template>
	<div class="FaqClientPage scrollY">
		<!-- <div class="searchBox">
      <TaggedInput
        :navigationStore="navigationStore"
      />
		</div>-->
		<div class="main">
			<ColumnNavigation :style="Style" />
			<!-- <div>scenario:</div> -->
			<!-- <VerticalNavigation
        v-if="sections.scenario.length > 0"
        :navigationStore="navigationStore"
        :range="sections.scenario"
      />
      <div>result:</div>
      <VerticalNavigation
        v-if="sections.result.length > 0"
        :navigationStore="navigationStore"
        :range="sections.result"
			/>-->
			<!-- <div style="height: 1024px">dammy</div> -->
		</div>
	</div>
</template>

<script lang="ts">
// import FaqClientMixin from '../mixins/FaqClientMixin';
// import { getViewSections } from '../common/resourceNavigationUtil';
import * as scrollUtil from "./scrollUtil";
import ColumnNavigation from "./ColumnNavigation.vue";
import { Watch } from "vue-property-decorator";
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
	components: { ColumnNavigation }
})
export default class FaqClientPage extends Vue {
	@Prop()
	height: any;
	get Style() {
		return {
			height: this.height || "400px"
		};
	}
	get sections() {
		return { talkScript: [] }; //getViewSections(this.navigationStore.state.routes);
	}
	@Watch("navigationStore.state.routes")
	onRouteChanged() {
		this.$nextTick(() => {
			const target = document.querySelector(".active");
			if (target) {
				scrollUtil.scrollIntoViewY(target);
			}
		});
	}
}
</script>

<style lang="scss" scoped>
.FaqClientPage {
	overflow-y: scroll;
	flex: 1;
	// border: 10px green solid;
	box-sizing: border-box;
	// display: flex;
	// flex-direction: column;
	> .searchBox {
		padding: 15px;
		background: #ccc;
	}
	> .main {
		// flex: 1;
		// display: flex;
		// flex-direction: column;
		// position: relative;
		// border: 10px blue solid;
		box-sizing: border-box;
	}
}
</style>
