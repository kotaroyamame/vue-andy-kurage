<template>
	<div class="vue-andy-kurage-arrow"></div>
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
	position: absolute !important;
	top: auto !important;
	right: 0 !important;
	left: 0 !important;
	bottom: 20px !important;
	margin: auto !important;
	background-image: url(./guideicon.png);
	background-position: center center;
	background-size: contain;
	background-repeat: no-repeat;
	width: 150px;
	height: 200px;
}
</style>
