import type { App } from 'vue';

export function registerComponents(app: App) {
  const stepModules = import.meta.glob('./components/StepModules/*.vue');
  const stepModuleStructures = import.meta.glob('./components/Management/Single/Session/*.vue');

  for (const path in stepModules) {
    const componentName = path.split('/').pop()?.replace('.vue', '');
    if (componentName) {
      stepModules[path]().then((module: any) => {
        app.component(componentName, module.default); // Register component globally
      });
    }
  }
  for (const path in stepModuleStructures) {
    const componentName = path.split('/').pop()?.replace('.vue', '');
    if (componentName) {
      stepModuleStructures[path]().then((module: any) => {
        app.component(componentName, module.default); // Register component globally
      });
    }
  }
}