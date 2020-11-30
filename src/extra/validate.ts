import { ProjectController } from './projectController';
import { ValidateController } from './validate/validateController';

(async () => {
  const projectController = new ProjectController();
  projectController.init();

  const validateController = new ValidateController(projectController);
  validateController.init();
  
})();
