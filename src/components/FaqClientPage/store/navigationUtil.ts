export const createSectionizer = (params: any) => (routes: any) => {
	const sections: any = {};
	let index = 0;
	let oldIndex = 0;
	for (const param of params) {
		while (index < routes.length && param.condition(routes[index])) {
			++index;
		}
		sections[param.name] = {
			start: oldIndex,
			end: index,
			length: index - oldIndex,
		};
		oldIndex = index;
	}
	return sections;
};
