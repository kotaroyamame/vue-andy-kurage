<template>
	<div>
		<slot @updateScrollGuide="updateScrollGuide"></slot>
		<div class="vue-andy-kurage-scrollGuide" v-show="showGuide">
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
		this.scrollContainer = this.$el.querySelector(".vue-andy-kurage-scrollY");
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
				this.scrollContainer.clientHeight + this.scrollContainer.scrollTop + 20 // 最後までスクロール
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

<style lang="scss">
.vue-andy-kurage-scrollGuide {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	opacity: 0.8;
	pointer-events: none;
	height: 320px;
	.vue-andy-kurage-pc & {
		margin-right: auto;
		margin-left: auto;
	}
	.vue-andy-kurage-pc .vue-andy-kurage-autocompleteWrapper & {
		height: 536px;
	}
	.vue-andy-kurage-mobile {
		margin: auto !important;
	}
}
</style>
