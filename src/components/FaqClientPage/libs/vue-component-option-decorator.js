import { createDecorator } from 'vue-class-component';

export function ComponentMethod() {
  return createDecorator((componentOptions, path) => {
    componentOptions[path] = componentOptions.methods[path];
    delete componentOptions.methods[path];
  });
}
