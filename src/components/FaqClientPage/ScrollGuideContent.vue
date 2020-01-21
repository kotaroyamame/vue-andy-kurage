<template>
	<div class="vue-andy-kurage-arrow">
		<div class="vue-andy-kurage-arrow__device">
			<i class="vue-andy-kurage-arrow__icon icon-mouse" aria-hidden="true"></i>
			<span class="vue-andy-kurage-arrow__text">Scroll</span>
		</div>
		<div class="vue-andy-kurage-arrow__cap"></div>
		<div class="vue-andy-kurage-arrow__line"></div>
	</div>
</template>
<script>
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class ScrollGuideContent extends Vue {}
</script>
<style lang="scss">
$arroColor: #888;

.vue-andy-kurage-arrow {
	position: static;
	&__device {
		position: absolute;
		right: 0;
		bottom: 80px;
		left: 0;
		box-sizing: border-box;
		width: 100px;
		height: 100px;
		margin:auto !important;
		margin-right: auto !important;
		margin-left: auto !important;
		padding: 12px;
		text-align: center !important;
		color: #fff;
		background: $arroColor;
		border-radius: 50px;
	}
	&__icon {
		font-size: 50px;
		margin:auto !important;
	}
	&__cap {
		position: absolute !important;
		margin:auto !important;
		right: 0 !important;
		bottom: 10px !important;
		left: 0 !important;
		width: 20px !important;
		height: 20px !important;
		margin-right: auto;
		margin-left: auto;
		border: 3px solid !important;
		border-color: transparent transparent $arroColor $arroColor !important;
		transform: rotate(-45deg) !important;
		text-align: center !important;
	}
	&__text {
		display: block;
		font-size: 16px;
		text-align: center !important;
		margin:auto !important;
	}
	&__line {
		position: absolute;
		padding:2px !important;
		right: 0;
		bottom: 10px;
		left: 0;
		width: 3px;
		height: 60px;
		margin:auto !important;
		margin-right: auto;
		margin-left: auto;
		background: $arroColor;
		text-align: center !important;
	}
}
</style>
