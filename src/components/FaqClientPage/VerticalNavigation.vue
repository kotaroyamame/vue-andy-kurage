<template>
	<div class="VerticalNavigation">
		VerticalNavigation
		<div class="navigationContentWrapper">

			<div ref="navigationContent" class="navigationContent">
				<div class="page clearfix" v-for="(route, routeIndex) in routes" :key="routeIndex">
					{{route.componentName}}
					{{State}}
					<component
						:is="route.componentName"
						:index="routeIndex"
						:currentValue="route"
						:prevValue="
							Routes[baseIndex + routeIndex - 1]
						"
						:nextValue="
							Routes[baseIndex + routeIndex + 1]
						"
						:currentLocal="locals[routeIndex]"
						:prevLocal="locals[routeIndex - 1]"
						:nextLocal="locals[routeIndex + 1]"
						:localActive="routeIndex === localIndex"
						:active="baseIndex + routeIndex === Index"
					></component>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import NavigationMixin from "./mixins/NavigationMixin";
import { navigationStoreModule } from "./store/navigationStore";
import ResourceList from "./columns/ResourceList.vue";
const bound = (value: any, min: any, max: any) => {
	return Math.min(Math.max(value, min), max);
};
class TouchParam {
	public x: number = 0;
	public y: number = 0;
	public startX: number = 0;
	public startY: number = 0;
	reset() {
		this.x = this.y = this.startX = this.startY = 0;
	}
	get X() {
		return this.x - this.startX;
	}
	get Y() {
		return this.y - this.startY;
	}
	public page() {
		if (Math.abs(this.X) < 20) {
			return 0;
		}
		if (Math.abs(this.X) - Math.abs(this.Y) < 0) {
			return 0;
		}
		return this.X;
	}
}
// tslint:disable-next-line:max-classes-per-file
@Component({
	components: {
		ResourceList
	}
})
export default class VerticalNavigation extends Vue {
	index = 0;
	boundedNavigationStores: any = [];
	componentWidth = 0;
	columnWidth = 300;
	localMap: any = new Map();
	locals = [];
	isFasttimeMove: boolean = false;
	touchParam = new TouchParam();
	get Routes() {
		return navigationStoreModule.Routes;
	}
	get Index() {
		return navigationStoreModule.Index;
	}
	@Prop()
	range: any;
	localParamsMap = new Map();
	canMovePositionBy(relative: any) {
		const newLocalIndex = this.localIndex + relative;
		return (
			newLocalIndex >= 0 &&
			newLocalIndex < this.routes.filter(r => r.viewType !== "result").length
		);
	}
	movePositionBy(relative: any) {
		const newLocalIndex = this.localIndex + relative;
		navigationStoreModule.movePositionTo(this.baseIndex + newLocalIndex);
		// this.navigationStore.commit(
		// 	'movePositionTo',
		// 	this.baseIndex + newLocalIndex
		// );
	}
	get baseIndex() {
		if (this.range) {
			return this.range.start;
		} else {
			return 0;
		}
	}
	get routes() {
		const routes = navigationStoreModule.Routes;
		if (this.range) {
			return routes.slice(this.range.start, this.range.end);
		} else {
			return routes;
		}
	}
	get localIndex() {
		return bound(
			navigationStoreModule.Index - this.baseIndex,
			0,
			this.routes.length - 1
		);
	}
	get navigationLeft() {
		console.log(this.componentWidth);
		return Math.min(
			this.componentWidth -
				this.columnWidth -
				this.localIndex * this.columnWidth,
			0
		);
	}

	onTouchstart(e: Event) {
		this.isFasttimeMove = true;
		e.stopPropagation();
	}
	onTouchend(e: Event) {
		const page = this.touchParam.page();
		console.log(page);

		if (page !== 0) {
			if (page < 0) {
				navigationStoreModule.movePositionTo(this.Index + 1);
			} else {
				navigationStoreModule.movePositionTo(this.Index - 1);
			}
			this.touchParam.reset();
		}
		e.stopPropagation();
	}
	onTouchmove(e: any) {
		const x = e.touches[0].pageX;
		const y = e.touches[0].pageY;
		if (this.isFasttimeMove) {
			this.touchParam.startX = x;
			this.touchParam.startY = y;
			this.isFasttimeMove = false;
		}
		this.touchParam.x = x;
		this.touchParam.y = y;
		e.stopPropagation();
	}
	@Watch("routes", { immediate: true })
	onUpdateRoute(routes: any) {
		const oldLocalMap = this.localMap;
		const localMap = new Map();
		const locals = routes.map((route: any) => {
			const local = oldLocalMap.get(route) || {
				scrollPosition: 0,
				selectedPosition: null
			};
			localMap.set(route, local);
			return local;
		});
		this.localMap = localMap;
		this.locals = locals;
	}
	getLocalParams(route: any) {
		if (!route) {
			return null;
		}
		if (!this.localParamsMap.has(route)) {
			this.localParamsMap.set(route, {
				scrollPosition: 0,
				selectedPosition: null
			});
		}
		return this.localParamsMap.get(route);
	}
	// lifecycle methods
	mounted() {
		setTimeout(() => {
			this.updateComponentWidth();
		}, 1000);

		window.addEventListener("resize", this.updateComponentWidth);
	}
	unmounted() {
		window.removeEventListener("resize", this.updateComponentWidth);
	}
	updateComponentWidth() {
		if (
			this.$refs.ColumnNavigation &&
			"clientWidth" in this.$refs.ColumnNavigation
		) {
			this.componentWidth = this.$refs.ColumnNavigation.clientWidth;
		}
	}
	// index dependent method
	getColumnLeft(index: any) {
		return index * this.columnWidth; // + this.touchParam.X;
	}
	getColumnWidth(index: any) {
		return this.columnWidth;
	}
	// getBoundedNavigationStore(index: any) {
	// 	return getBoundedNavigationStore(navigationStoreModule, index);
	// }
}
</script>
<style lang="scss" scoped>
%bottomTriangle {
	content: "";
	position: absolute;
	right: 50px;
	bottom: -40px;
	left: 50px;
	display: inline-block;
	width: 0;
	height: 0;
	margin: auto;
	border: 20px solid;
	border-color: #0a69d8 transparent transparent;
}

.VerticalNavigation {
	box-sizing: border-box;
	height: 100%;
}
.navigationContentWrapper {
	box-sizing: border-box;
	width: 100%;
	padding: 0 30px;
	overflow: hidden;
	.hasScenario & {
		padding-right: 20px;
		padding-left: 20px;
	}
}
.navigationContent {
	width: 100%;
}
.page {
	box-sizing: border-box;
	margin-bottom: 30px;
	padding-bottom: 30px;
	&:not(:last-child) {
		position: relative;
		border-bottom: 2px solid #0a69d8;
		&:before {
			@extend %bottomTriangle;
		}
	}
	.resultContent & {
		margin-bottom: 0;
		padding-bottom: 0;
	}
	.scenario__section:not(:last-child) &:last-child {
		position: relative;
		border-bottom: 2px solid #0a69d8;
		&:before {
			@extend %bottomTriangle;
		}
	}
}

.ancester {
	font-size: 14px;
}
</style>
