import { PluginObject } from 'vue';
import { Component, Prop, Vue as _Vue } from 'vue-property-decorator';
import AndyKurageComp from './Wrapper.vue';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
export const AndyKurage: PluginObject<any> = {
	installed: false,
	install(Vue: typeof _Vue, options?: any): void {
		if (this.installed) {
			return;
		}
		this.installed = true;

		Vue.component('AndyKurage', AndyKurageComp);

	},
};
