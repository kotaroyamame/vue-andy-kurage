// import resource from './resource';

export class Scenario {
	readyPromise: any = null;

	scenarios: any;
	constructor() {
	}
	getList() {
		return this.scenarios
	}
	get(id: any) {
		return this.scenarios && this.scenarios[id];
	}
	getAsync(id: any) {
		return this.scenarios && this.scenarios[id];
	}
	ready(data: any) {
		this.prepare(data);
	}
	prepare(data: any) {

		// scienarioをstepを中心とする形に変換する
		const scenarios: any = {};
		const travarseFlow = (flow: any, stepMap: any) => {
			const step = stepMap[flow.step];
			if (flow.next) {
				if (!step._options) {
					step._options = step.options;
				}
				step.options = flow.next.map((_flow: any) => ({
					condition: _flow.condition,
					stepId: _flow.step,
					// step: stepMap[_flow.step],
				}));
				flow.next.forEach((_flow: any) => {
					travarseFlow(_flow, stepMap);
				});
			}
			return step;
		};
		for (const scenario of data.scenario) {
			if (scenario == null) {
				continue;
			}
			const rootStep = travarseFlow(scenario.flow[0], scenario.step);
			scenarios[scenario.id] = {
				rootStep,
				rootStepId: rootStep.id,
				steps: scenario.step,
				scenarioId: scenario.id,
			};
		}
		this.scenarios = scenarios;
		// console.log('scenarios', scenarios);
	}
}

// const scenario = new Scenario(resource);
// export default scenario;
