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
	}
	&__cap {
		position: absolute;
		right: 0;
		bottom: 10px;
		left: 0;
		width: 20px;
		height: 20px;
		margin-right: auto;
		margin-left: auto;
		border: 3px solid;
		border-color: transparent transparent $arroColor $arroColor;
		transform: rotate(-45deg);
		text-align: center !important;
	}
	&__text {
		display: block;
		font-size: 16px;
		text-align: center !important;
	}
	&__line {
		position: absolute;
		right: 0;
		bottom: 10px;
		left: 0;
		width: 3px;
		height: 60px;
		margin-right: auto;
		margin-left: auto;
		background: $arroColor;
		text-align: center !important;
	}
}
</style>
