import dataResource from './dataResource';
import { createSectionizer } from './store/navigationUtil';
import base64url from 'base64url';

export const getViewSections = createSectionizer([
  {
    name: 'talkScript',
    condition: route => route.viewType === 'talkScript',
  },
  {
    name: 'scenario',
    condition: route => route.viewType === 'scenario',
  },
  {
    name: 'result',
    condition: route => route.viewType === 'result',
  },
]);

export const getResourceSections = createSectionizer([
  {
    name: 'talkScript',
    condition: route => route.talkScriptId,
  },
  {
    name: 'scenario',
    condition: route => true,
  },
]);

export const openByResource = (navigationStore, { talkScript, scenarios }) => {
  const routes = [];
  for (let current = talkScript; current; current = current.parent) {
    routes.unshift(current);
  }
  routes.push.apply(routes, scenarios);
	navigationStoreModule.setRoutes( routes);
};

export const fromRoute = async ({ talkScriptId, stepEncoded }) => {
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
        stepIds.map(stepId =>
          dataResource.getItem({
            resourceName: 'scenario',
            scenarioId: talkScript.scenarioId,
            stepId,
          })
        )
      )),
  };
};

export const toRoute = routes => {
  const sections = getResourceSections(routes);
  const talkScriptId = routes[sections.talkScript.end - 1].talkScriptId;
  return {
    talkScriptId: talkScriptId === '#' ? null : talkScriptId,
    stepEncoded: sections.scenario.length
      ? base64url(
          JSON.stringify(
            routes
              .slice(sections.scenario.start, sections.scenario.end)
              .map(scenario => scenario.stepId)
          )
        )
      : undefined,
  };
};
