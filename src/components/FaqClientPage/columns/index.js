const importAll = context => {
  const modules = {};
  for (const key of context.keys()) {
    const match = key.match(/^\.\/([A-Za-z0-9_-]+)\.vue$/);
    if (match) {
      const name = match[1];
      modules[name] = context(key).default;
    }
  }
  return modules;
};
const webPackContext = require.context(
  './',
  false,
  /^\.\/([A-Za-z0-9_-]+)\.vue$/
);
const modules = importAll(webPackContext);

export default modules;
