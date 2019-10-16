import { TalkScript } from '../talkScriptApi';

export class TalkScriptResource {
	cache = new WeakMap();
	talkScript = new TalkScript();
	constructor() {

	}
	ready(data: any) {
		this.talkScript.prepare(data);
	}
	getList(params: any) {
		const list = params.talkScriptId
			? this.talkScript.listByParentId(params.talkScriptId)
			: this.talkScript.list();
		return list && list.map(this.convertItem);
	}
	getRoutesById(id: string) {
		const routes = [];
		let currentScript = this.talkScript.get(id);
		console.log(currentScript);
		let parentID = currentScript.parent;
		routes.unshift(currentScript.id);
		routes.unshift(parentID);
		while (parentID && parentID != '#') {
			currentScript = this.talkScript.get(parentID);
			parentID = currentScript.parent;
			routes.unshift(parentID);
		}
		return routes.map((talkScriptId: any) => {
			console.log(talkScriptId);
			return this.getItemSync({ talkScriptId });
		});
	}
	isEquals(a: any, b: any) {
		return a.talkScriptId === b.talkScriptId;
	}
	topItem = {
		text: 'トップ',
		viewType: 'talkScript',
		parentViewType: 'talkScript',
		componentName: 'ResourceList',
		resourceName: 'talkScript',
		talkScriptId: '#',
	};
	getItemSync(params: any) {
		if (!params.talkScriptId || params.talkScriptId === '#') {
			return this.topItem;
		} else {
			const item = this.talkScript.getSync(params.talkScriptId);
			return item && this.convertItem(item);
		}
	}

	getItem(params: any) {
		if (!params.talkScriptId || params.talkScriptId === '#') {
			return this.topItem;
		} else {
			const item = this.talkScript.get(params.talkScriptId);
			return item && this.convertItem(item);
		}
	}
	convertItem = (item: any) => {
		if (!this.cache.has(item)) {
			const convertedItem = {
				text: item.text,
				caption: item.value,
				talkScriptId: item.id,
				componentName: 'ResourceList',
				parentViewType: 'talkScript',
				items: item.items,
				ancesters: item.ancesters,
				keywords: item.keywords,
				parent: this.getItemSync({
					talkScriptId: item.parent,
				}),
			};
			if (item.type === 'node') {
				this.cache.set(
					item,
					Object.assign(convertedItem, {
						resourceName: 'talkScript',
						viewType: 'talkScript',
						talkScriptType: 'node',
					})
				);
			} else if (item.type === 'leaf' && item.scenario) {
				this.cache.set(
					item,
					Object.assign(convertedItem, {
						resourceName: 'scenario',
						scenarioId: item.scenario,
						viewType: 'scenario',
						talkScriptType: 'leaf',
					})
				);
			} else if (item.type === 'leaf' && item.items) {
				this.cache.set(
					item,
					Object.assign(convertedItem, {
						resourceName: 'talkScript',
						scenarioId: item.items.scenario_id,
						viewType: 'result',
						talkScriptType: 'leaf',
					})
				);
			} else {
				this.cache.set(
					item,
					Object.assign(convertedItem, {
						resourceName: 'talkScript',
						viewType: 'result',
						talkScriptType: 'leaf',
					})
				);
			}
		}
		return this.cache.get(item);
	};
}
