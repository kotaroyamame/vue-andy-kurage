<template>
	<ScrollGuide ref="scrollGuide">
		<div :class="[active && 'active', 'ResourceList', 'scrollY']" v-scroll="onScroll">
			<div class="caption" v-show="item && item.caption" v-html="item && item.caption"></div>
			<div ref="items" class="items">
				<div
					:class="['item', isSelected(item) && 'selected']"
					v-for="(item, index) in List()"
					:key="index"
				>
					<div class="relation">
						<div class="relation-line"></div>
					</div>
					<div class="itemContent" @click="open(item)" :item-debug="JSON.stringify(item)">
						<!-- 要実装：itemクラスにleafクラスを付与するとQアイコンが表示される。-->
						<span>
							<span class="itemIcon"></span>
							{{ item.text }}
						</span>
						<!-- <i
              @click="
                edit(item);
                $event.stopPropagation();
              "
              class="fa fa-edit"
						></i>-->
						<i class="fa fa-chevron-right"></i>
					</div>
				</div>
			</div>
		</div>
		<div ref="anchor" class="anchor">
			<span class="anchorBar"></span>
			<span class="anchorBox"></span>
		</div>
	</ScrollGuide>
</template>
<script lang="ts">
import Vue2 from "vue";
// import Component from 'vue-class-component';
import { Watch } from "vue-property-decorator";
// import dataResource from "../dataResource";
import { updateRelation, getSelectionPosition } from "../relation";
import { AsyncComputed } from "../libs/vue-async-computed-decorator";
// import { modalService } from "../common/modalService";
// import ModalSample from "../ModalSample";
import { scrollIntoViewY } from "../scrollUtil";
import _ from "lodash";
import { Component, Vue, Prop } from "vue-property-decorator";
import ScrollGuide from "../ScrollGuide.vue";
import { navigationStoreModule } from "../store/navigationStore";
// Vue.directive("scroll", {
// 	inserted: function(el, binding) {
// 		let f = function(evt: any) {
// 			if (binding.value(evt, el)) {
// 				// window.removeEventListener('scroll', f);
// 			}
// 		};
// 		el.addEventListener("scroll", f);
// 	}
// });

@Component({
	components: {
		ScrollGuide
	},
	directives: {
		scroll: {
			inserted: function(el, binding) {
				let f = function(evt: any) {
					if (binding.value(evt, el)) {
						// window.removeEventListener('scroll', f);
					}
				};
				el.addEventListener("scroll", f);
			}
		}
	}
})
export default class ResourceList extends Vue {
	@Prop()
	currentValue: Object | undefined;
	@Prop()
	prevValue: Object | undefined;
	@Prop()
	nextValue: Object | undefined;
	@Prop()
	prevLocal: Object | undefined;
	@Prop()
	nextLocal: Object | undefined;
	@Prop()
	currentLocal: any;
	@Prop()
	index: Number | undefined;
	@Prop()
	active: Boolean | undefined;
	item: any = {};
	list: any = [];
	created() {
		this.item = this.Item();
		this.list = this.List();
	}
	// @AsyncComputed()
	List() {
		const dataResource = navigationStoreModule.DataResource;
		if (dataResource) {
			const list = dataResource.getList(this.currentValue);
			return list;
		}
		return [];
	}
	// @AsyncComputed()
	Item() {
		const dataResource = navigationStoreModule.DataResource;
		if (dataResource && 'getItem' in dataResource) {
			const item = dataResource.getItem(this.currentValue);
			return item;
		}
		return {};
	}
	@Watch("list")
	onUpdateList(list: any, oldList: any) {
		if (_.isEqual(list, oldList)) {
			return;
		}

		const refs: any = this.$refs;
		Vue2.nextTick(() => {
			refs.scrollGuide && refs.scrollGuide.updateScrollGuide();
		});
	}
	@Watch("item")
	onUpdateItem(item: any, oldItem: any) {
		if (_.isEqual(item, oldItem)) {
			return;
		}
		const refs: any = this.$refs;
		Vue2.nextTick(() => {
			refs.scrollGuide && refs.scrollGuide.updateScrollGuide();
		});
	}
	public open(route: any) {
		console.log(route);
		let index: any = this.index === undefined ? 0 : this.index;
		// index++;
		navigationStoreModule.open({ route, index });
	}
	edit(item: any) {
		// modalService.openModal({ component: ModalSample });
	}
	isSelected(item: any) {
		const dataResource = navigationStoreModule.DataResource;
		if (dataResource) {
			return dataResource.isEquals({ a: item, b: this.nextValue });
		}
		return false;
	}
	onScroll(e: any) {
		if (
			e.target.scrollTop >= 0 &&
			e.target.scrollTop <= e.target.scrollHeight - e.target.clientHeight
		) {
			this.currentLocal.scrollPosition = e.target.scrollTop;
			this.updateRelation();
		}
	}
	@Watch("prevLocal.scrollPosition", { deep: true, immediate: true })
	onPrevLocalChange(scrollPosition: any) {
		this.updateRelation();
	}
	@Watch("prevLocal.selectedPosition", { deep: true, immediate: true })
	onPrevLocalChange2(scrollPosition: any) {
		this.updateRelation();
	}
	updated() {
		this.currentLocal.selectedPosition = getSelectionPosition({
			items: this.$refs.items
		});
		const selectedElement = this.$el.querySelector(".selected");
		if (selectedElement) {
			setTimeout(() => {
				scrollIntoViewY(selectedElement);
			}, 20);
		}
		Vue2.nextTick(() => {
			this.updateRelation();
		}, 0);
	}
	updateRelation() {
		updateRelation({
			root: this.$el,
			items: this.$refs.items,
			prevLocal: this.prevLocal,
			currentLocal: this.currentLocal,
			scrollAnchor: this.$refs.scrollAnchor,
			anchor: this.$refs.anchor,
			getRelation: (item: any) => item.children[0].children[0],
			disable: !this.list || !this.list.length
		});
	}
}
</script>
<style lang="scss" scoped>
@mixin gradation($gradationColor1, $gradationColor2) {
	/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#3b679e+0,7db9e8+100 */
	background: $gradationColor2; /* Old browsers */
	background: -moz-linear-gradient(
		top,
		$gradationColor1 30%,
		$gradationColor2 100%
	); /* FF3.6-15 */
	background: -webkit-linear-gradient(
		top,
		$gradationColor1 30%,
		$gradationColor2 100%
	); /* Chrome10-25,Safari5.1-6 */
	background: linear-gradient(
		to bottom,
		$gradationColor1 30%,
		$gradationColor2 100%
	); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#{$gradationColor1}', endColorstr='#{$gradationColor2}',GradientType=1 ); /* IE6-9 */
}

@mixin active-button-color() {
	@include gradation(#468de8, #0a69d8);
}

@mixin nonactive-button-color() {
	@include gradation(#fefefe, #ededed);
}
$activeRelationColor: #0a69d8 !default;
$themaBackgroundColor: #004198 !default;
$listButtonColor: #1d7ae9 !default;
$headingColor: #0a3998 !default;
$listTextColor: #004198 !default;
$highlightColor: #f7ba4a !default;
$relationColor: #ccc !default;

$summaryBorderColor: #e4e2e6 !default;
$summaryBackgroundColor: #f4f2f6 !default;
$summaryNonactiveItemColor: #fff !default;
// $summaryActiveItemColor: #0a69d8 !default;
$summaryActiveItemColor: #0a69d8 !default;
$summaryActiveItemFontColor: #f8f8f8 !default;

$headerHeight: 100px !default;
$summaryHeight: 24px !default;
$summaryItemHeight: 24px !default;

$headerImageWidth: 92px !default;

.ResourceList {
	.VerticalNavigation & {
		padding: 15px;
		overflow-y: initial;
		.resultContent & {
			padding: 0;
		}
	}
	.ColumnNavigation & {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		padding: 5px 0;
		overflow-x: hidden;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
		user-select: none;
	}
	&.active {
		background: #fff8f8;
	}
	img {
		display: block;
		max-width: 90%;
		margin: 0 auto;
	}
}

.items {
	.VerticalNavigation & {
		overflow: hidden;
	}
}

.item {
	position: relative;
	.VerticalNavigation & {
		display: block;
		float: left;
		width: 33.333%;
	}
	&.leaf .itemIcon {
		height: 20px;
		width: 20px;
		display: inline-block;
		// background-image: url(./../../resource/n/q.png);
		background-repeat: no-repeat;
		background-size: contain;
		vertical-align: middle;
		margin-right: 5px;
	}
}

.itemContent {
	@include nonactive-button-color();
	display: flex;
	align-items: center;
	margin: 5px 8px 5px 25px;
	padding: 5px;
	color: $listTextColor;
	border: 1px solid #ccc;
	border-radius: 4px;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
	&:hover {
		opacity: 0.5;
	}
	&:active {
		opacity: 0.3;
	}
	&::before {
		content: "";
		position: absolute;
		top: 5px;
		bottom: 5px;
		left: 30px;
		width: 2px;
	}
	> span {
		display: block;
		flex: 1;
		margin-right: 5px;
		margin-left: 10px;
		padding: 4px;
	}
	> i {
		margin-right: 5px;
		font-size: 10px;
		line-height: 8px;
		vertical-align: middle;
		text-align: center;
		color: $listButtonColor;
		position: absolute;
		right: 5px;
		top: 50%;
		margin-top: -5px;
	}
	.item.selected & {
		color: #fff;
		border: 1px solid transparent;
		@include active-button-color();
		i {
			color: #fff;
		}
	}
	.VerticalNavigation & {
		position: relative;
		display: inline-block;
		width: 93%;
		margin-left: 8px;
		&:before {
			left: auto;
		}
	}
	.mobile & {
		font-size: 14px;
	}
}

.anchor,
.relation {
	.VerticalNavigation & {
		display: none !important;
	}
}

.anchor {
	position: absolute;
	top: 50px;
	left: 7px;
	&.selected {
		.anchorBar {
			top: -1px;
			border-width: 3px;
			border-color: $activeRelationColor;
		}
		.anchorBox {
			background: $activeRelationColor;
		}
	}
}

.anchorBox {
	position: absolute;
	top: -4px;
	width: 8px;
	height: 8px;
	background: $relationColor;
	border-radius: 4px;
}

.anchorBar {
	position: absolute;
	top: 0;
	right: -1px;
	width: 16px;
	border-top: 1px solid $relationColor;
}

.scrollAnchor {
	left: 10px;
	.anchorBox {
		background: #f00;
	}
}

.ColumnNavigation {
	[ref="anchor"],
	.scrollGuide {
		display: none;
	}
}

.relation {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 10px;
	width: 15px;
	.item.selected & {
		top: -1px;
	}
}
.relation-line {
	position: absolute;
	right: 0;
	left: 0;
	.item.upper & {
		top: 50%;
		bottom: auto;
		border-top: 1px solid $relationColor;
		border-left: 1px solid $relationColor;
		border-top-left-radius: 15px;
	}
	.item.lower & {
		top: auto;
		bottom: 50%;
		border-bottom: 1px solid $relationColor;
		border-left: 1px solid $relationColor;
		border-bottom-left-radius: 15px;
	}
	.item.selected & {
		border-width: 3px;
		border-color: $activeRelationColor;
		z-index: 1;
	}
}

.caption {
	white-space: pre-wrap;
	.VerticalNavigation & {
		display: block;
		margin: 24px 0;
		font-weight: bold;
		font-size: 18px;
		color: #4c6874;
		.resultContent & {
			margin-bottom: 4px;
			color: #000;
			font-weight: normal;
			font-size: 16px;
			.hasScenario & {
				color: #4c6874;
			}
		}
	}
	.ColumnNavigation & {
		padding: 10px 10px 10px 20px;
	}
	.mobile & {
		padding-top: 15px;
		padding-bottom: 15px;
		line-height: 1.5;
		font-size: 14px;
		color: #000;
	}
}
</style>
