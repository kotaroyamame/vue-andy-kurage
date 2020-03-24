import { DataResource } from './dataResource';
import { createSectionizer } from './store/navigationUtil';
import base64url from 'base64url';
import { navigationStoreModule } from "./store/navigationStore";
const dataResource = new DataResource();
export const getViewSections = createSectionizer([
	{
		name: 'talkScript',
		condition: (route: any) => route.viewType === 'talkScript',
	},
	{
		name: 'scenario',
		condition: (route: any) => route.viewType === 'scenario',
	},
	{
		name: 'result',
		condition: (route: any) => route.viewType === 'result',
	},
]);

export const getResourceSections = createSectionizer([
	{
		name: 'talkScript',
		condition: (route: any) => route.talkScriptId,
	},
	{
		name: 'scenario',
		condition: (route: any) => true,
	},
]);

export const openByResource = (navigationStore: any, { talkScript, scenarios }: any) => {
	const routes = [];
	for (let current = talkScript; current; current = current.parent) {
		routes.unshift(current);
	}
	routes.push.apply(routes, scenarios);
	navigationStoreModule.setRoutes(routes, false);
};

export const fromRoute = async ({ talkScriptId, stepEncoded }: any) => {
	const stepIds = stepEncoded && JSON.parse(base64url.decode(stepEncoded));
	const talkScript = await dataResource.getItem({
		resourceName: 'talkScript',
		talkScriptId,
	});
	return {
		talkScript: talkScript,
		scenarios:
			stepIds &&
			(await Promise.all(
				stepIds.map((stepId: any) =>
					dataResource.getItem({
						resourceName: 'scenario',
						scenarioId: talkScript.scenarioId,
						stepId,
					})
				)
			)),
	};
};

export const toRoute = (routes: any) => {
	const sections = getResourceSections(routes);
	const talkScriptId = routes[sections.talkScript.end - 1].talkScriptId;
	return {
		talkScriptId: talkScriptId === '#' ? null : talkScriptId,
		stepEncoded: sections.scenario.length
			? base64url(
				JSON.stringify(
					routes
						.slice(sections.scenario.start, sections.scenario.end)
						.map((scenario: any) => scenario.stepId)
				)
			)
			: undefined,
	};
};
