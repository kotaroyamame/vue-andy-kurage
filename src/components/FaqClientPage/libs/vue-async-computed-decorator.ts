import { createDecorator } from 'vue-class-component';

export function AsyncComputed(options?: any) {
	return createDecorator((componentOptions: any, path: any) => {
		if (typeof componentOptions.asyncComputed !== 'object') {
			componentOptions.asyncComputed = Object.create(null);
		}
		componentOptions.asyncComputed[path] = Object.assign(
			{
				get: componentOptions.methods[path],
				debounce: false,
			},
			options
		);
		delete componentOptions.methods[path];
	});
}
