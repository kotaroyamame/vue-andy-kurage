import { TalkScriptResource, ScenarioResource } from './dataResourceFactory';
import { TalkScript } from './talkScriptApi';
import { Scenario } from './scenarioApi';
// const dataResourceFactory: any = _dataResourceFactory;
// console.log(dataResourceFactory);

export class DataResource {
	dataResourceFactory: any = { talkScript: new TalkScriptResource(), scenario: new ScenarioResource() };
	setDataResource(dataResource: any) {
		this.dataResourceFactory.talkScript.ready(dataResource);
		this.dataResourceFactory.scenario.ready(dataResource);
	}
	getList(params: any) {
		console.log(params.resourceName);
		return this.dataResourceFactory[params.resourceName].getList(params);
	}
	getItem(params: any) {
		return this.dataResourceFactory[params.resourceName].getItem(params);
	}
	getTopItem(){
		return this.dataResourceFactory.talkScript.getTopItem();
	}
	getRoutesById(id: string) {
		return this.dataResourceFactory.talkScript.getRoutesById(id);
	}
	getItemSync(params: any) {
		return this.dataResourceFactory[params.resourceName].getItemSync(params);
	}
	ready(params: any) {
		return this.dataResourceFactory[params.resourceName].ready();
	}
	public isEquals(obj: { a: any, b: any }): any {
		const { a, b } = obj;
		if (Array.isArray(a) && Array.isArray(b)) {
			return (
				a.length === b.length &&
				a.every((item, index) => this.isEquals({ a: item, b: b[index] }))
			);
		}
		return (
			a &&
			b &&
			a.resourceName === b.resourceName &&
			this.dataResourceFactory[a.resourceName].isEquals(a, b)
		);
	}
}

// const dataResource = new DataResource();
// export default dataResource;
