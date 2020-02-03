<template>
	<div>
		<slot @updateScrollGuide="updateScrollGuide"></slot>
		<div class="scrollGuide" v-show="showGuide">
			<ScrollGuideContent />
		</div>
	</div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ScrollGuideContent from "./ScrollGuideContent.vue";
@Component({
	components: { ScrollGuideContent }
})
export default class ScrollGuide extends Vue {
	showGuide = false;
	scrollContainer: any = null;
	scrolled(value: any) {
		this.showGuide = !value;
	}
	mounted() {
		this.scrollContainer = this.$el.querySelector(".scrollY");
		this.scrollContainer &&
			this.scrollContainer.addEventListener("scroll", this.onScroll);
		setTimeout(() => {
			this.onScroll(null, true);
		}, 100);
	}
	unmounted() {
		this.scrollContainer &&
			this.scrollContainer.removeEventListener("scroll", this.onScroll);
	}
	updateScrollGuide() {
		this.onScroll(null, true);
	}
	onScroll(event: any, forceSet: any) {
		if (
			this.scrollContainer.scrollTop > 10 || // 動かす
			this.scrollContainer.scrollHeight <
				this.scrollContainer.clientHeight + this.scrollContainer.scrollTop + 2 // 最後までスクロール
		) {
			this.showGuide = false;
		} else if (forceSet) {
			this.showGuide = true;
		}
		// console.log(
		//   forceSet,
		//   this.scrollContainer.scrollTop,
		//   this.scrollContainer.scrollHeight,
		//   this.scrollContainer.clientHeight + this.scrollContainer.scrollTop
		// );
	}
}
</script>

<style lang="scss" scoped>
.scrollGuide {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	opacity: 0.8;
	pointer-events: none;
	height: 320px;
	.pc & {
		margin-right: auto;
		margin-left: auto;
	}
	.pc .autocompleteWrapper & {
		height: 536px;
	}
	.mobile {
		margin: auto !important;
	}
}
</style>
