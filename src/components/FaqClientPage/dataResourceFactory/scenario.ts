import { Scenario } from '../scenarioApi';
// declare var window: any;
// console.log(scenarioApi);

// (async () => {
// 	scenarioApi.ready();
// })();

export class ScenarioResource {
	cache: any = new WeakMap();
	scenariolist: any = new Scenario();
	constructor() {

	}
	ready(scenariolist: any) {
		this.scenariolist.ready(scenariolist);
	}
	getList(params: any) {
		console.log("Scenario getList");
		let scenario = this.scenariolist.scenarios[params.scenarioId];
		if (scenario == undefined) {
			for (const key in this.scenariolist.scenarios) {
				if (params.scenarioId == this.scenariolist.scenarios[key].rootStep.scenarioId) {
					scenario = this.scenariolist.scenarios[key];
					break;
				}
			}
		}
		if (scenario) {
			let step: any = null;
			if (params.stepId) {
				step = scenario.steps[params.stepId];
			} else {
				step = scenario.rootStep;
			}
			return step.options.map((option: any) =>
				this.convertOption({ scenario, step, option })
			);
		}
		return [];
	}
	isEquals(a: any, b: any) {
		return (
			a.scenarioId === b.scenarioId &&
			a.stepId === b.stepId &&
			a.talkScriptId === b.talkScriptId
		);
	}

	getItem(params: any) {
		console.log("Scenario getItem");
		let scenario = this.scenariolist.scenarios[params.scenarioId];
		if (scenario == undefined) {
			for (const key in this.scenariolist.scenarios) {
				if (params.scenarioId == this.scenariolist.scenarios[key].rootStep.scenarioId) {
					scenario = this.scenariolist.scenarios[key];
				}
			}
		}
		if (params.stepId) {
			return this.convertStep({
				step: scenario.steps[params.stepId],
				scenario,
			});
		} else {
			return this.convertStep({ step: scenario.rootStep, scenario });
		}
	}
	convertStep = ({ step, scenario }: any) => {
		if (!step) {
			console.error('imcompatible scenario');
			return;
		}
		if (!this.cache.has(step)) {
			this.cache.set(step, {
				text: step.title,
				caption: step.text,
				scenarioId: scenario.scenarioId,
				stepId: step.id,
				componentName: 'ResourceList',
				resourceName: 'scenario',
				viewType: step.type === 'a' ? 'result' : 'scenario',
			});
		}
		return this.cache.get(step);
	};
	convertOption = ({ option, scenario }: any) => {
		if (!this.cache.has(option)) {
			const step = scenario.steps[option.stepId];
			this.cache.set(option, {
				// convertOptionでは、converStepと異なり、option側のテキストを使う（通常は同じ）
				text: option.condition.value,
				caption: step.text,
				scenarioId: scenario.scenarioId,
				stepId: step.id,
				componentName: 'ResourceList',
				resourceName: 'scenario',
				viewType: step.type === 'a' ? 'result' : 'scenario',
			});
		}
		return this.cache.get(option);
	};
}

// export const scenarioResource = new ScenarioResource();

// window.scenarioResource = scenarioResource;
// window.scenarioApi = scenarioApi;
