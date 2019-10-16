
import { navigationStoreModule } from '../store/navigationStore';
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
const bound = (value: any, min: any, max: any) => {
	return Math.min(Math.max(value, min), max);
};

@Component({
	// components: columnComponents,
})
export default class NavigationMixin extends Vue {
	index = 0;
	boundedNavigationStores: any = [];
	componentWidth = 0;
	columnWidth = 300;
	localMap: any = new Map();
	locals = [];
	@Prop()
	range: any;
	localParamsMap = new Map();
	canMovePositionBy(relative: any) {
		const newLocalIndex = this.localIndex + relative;
		return newLocalIndex >= 0 && newLocalIndex < this.routes.length;
	}
	movePositionBy(relative: any) {
		const newLocalIndex = this.localIndex + relative;
		navigationStoreModule.movePositionTo(
			this.baseIndex + newLocalIndex
		);
	}
	get baseIndex() {
		if (this.range) {
			return this.range.start;
		} else {
			return 0;
		}
	}
	get routes() {
		if (this.range) {
			return navigationStoreModule.Routes.slice(
				this.range.start,
				this.range.end
			);
		} else {
			return navigationStoreModule.Routes;
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
		return Math.min(
			this.componentWidth - (this.localIndex + 1) * this.columnWidth,
			0
		);
	}
	@Watch('routes', { immediate: true })
	onUpdateRoute(routes: any) {
		const oldLocalMap = this.localMap;
		const localMap = new Map();
		const locals = routes.map((route:any) => {
			const local = oldLocalMap.get(route) || {
				scrollPosition: 0,
				selectedPosition: null,
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
				selectedPosition: null,
			});
		}
		return this.localParamsMap.get(route);
	}
	// lifecycle methods
	mounted() {
		this.updateComponentWidth();
		window.addEventListener('resize', this.updateComponentWidth);
	}
	unmounted() {
		window.removeEventListener('resize', this.updateComponentWidth);
	}
	updateComponentWidth() {
		if (this.$refs.navigationContent && 'clientWidth' in this.$refs.navigationContent) {
			this.componentWidth = this.$refs.navigationContent.clientWidth;
		}
	}
	// index dependent method
	getColumnLeft(index: any) {
		return index * this.columnWidth;
	}
	getColumnWidth(index: any) {
		return this.columnWidth;
	}

}
