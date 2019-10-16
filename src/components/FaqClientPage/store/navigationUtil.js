export const createSectionizer = params => routes => {
  const sections = {};
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
