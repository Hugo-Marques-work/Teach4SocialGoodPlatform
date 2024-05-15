# How to create a module
This is a simplistic guide on how to add a new module to the code, by mentioning which files need to be altered and what kind of change needs to be made there.

It's generally recommended to copy an existing module, especially when creating files, in the following steps. (If you want to copy, try to choose the most similar module to the new one you wish to create)

## If module has results (or data to save)
Modules with results are more complex and therefore can't be included in a simple way, they follow the same steps bellow, but need custom routes and functionality. However please remember to:
- Path `src/models/result`
  - Create new result class (and other auxiliary classes if needed)
- Path `src/models/result/userModuleResult.model.ts`
  - Add the relationship @HasMany(() => NewResultClass)
- Path `src/controllers/modules/`
  - On your newly created moduleControl, don't forget to add the functions getExportValues and getResults (check individualQuizControl if in doubt)
- Path `src/controllers/module.controller.ts`
  - Be sure to alter the functions related to results to include your new result
- Path `src/controllers/user.controller.ts`
  - Change submitStep to save results when submitting the step
  
## Backend
### Models (Classes and Database Tables)
- Path `src/models/modules`
  - Create new module class (and other auxiliary classes if needed)
- Path `src/models/pack/sessionOrderedModule.model.ts`
  - Add the relationship @HasOne(() => NewModuleClass)
- Path `src/models/index.ts`
  - Import the module and add it to the list of classes to be added to sequelize

### Controllers
- Path `src/controllers/modules`
  - Create new moduleControl extending ModuleControls<NewModuleClass>
- Path `src/controllers/module.controller.ts`
  - Add the new module to the list of moduleControls (end of file), which are exported
  - Add the new module to the list of moduleControlRoutes, which are used for setting up automatic routing for get and put requests
  - Add the new module to every relevant function
- Path `src/controllers/user.controller.ts`
  - Add your module to the function submitStep

## Frontend
### Models (Classes)
- Path `src/models/ModuleType`
  - Add new Module Type
- Path `src/models/ModuleTypeSpec`
  - Add the new module and it's specifications
- Path `src/models/ModuleController`
  - Add the new module to every function
  - Take attention that the names match the ones in the backend (specifically the names of your new moduleControl)

### Remote Service
- Path `src/services/RemoteService.ts`
  - Delegate routes for your new module
- Path `src/services/SessionService.ts`
  - Create routes for your new module
    - Get<ModuleName>
    - Put<ModuleName>
- Path `src/services/PackService.ts`
  - Create routes for your new module to be used as a template
    - GetTemplate<ModuleName>
    - PutTemplate<ModuleName>

### UI Elements to create
``` Be sure that the component names match the names given in models (Classes) ```

- Path `src/components/StepModules/`
  - Create new file with the frontend appearance and logic of the module
- Path `src/components/Management/Single/Session/`
  - Create new file with the edition UI for the module (structure)
