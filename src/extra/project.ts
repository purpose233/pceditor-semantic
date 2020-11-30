import path from 'path';
import { RenderNode } from '../render/renderNode';
import { ProjectController, ProjectInfo } from './projectController';

// class Controller {

//   private projectContainer: HTMLElement = document.getElementById('projectContainer')
//   private addProjectBtn: HTMLElement = document.getElementById('btnAddProject');

//   public init(projects: ProjectInfo[]) {

//   }

//   public updateProjects(): void {}

//   public addProject(project: ProjectInfo): void {}

//   public deleteProject(project: ProjectInfo): void {}
// }


class DataTransfer {
  // async requestTree(project: ProjectInfo): Promise<RenderTree> {}
  // async requestNode(nodeId: string, project: ProjectInfo): Promise<RenderNode> {}
  // async updateNode(node: RenderNode, project: ProjectInfo): Promise<boolean> {}
  // async updateMap(map: Map, project: ProjectInfo): Promise<boolean> {}
  // async updateCases(cases: TestCase[], project: ProjectInfo): Promise<boolean> {}
  //  generateMesh
  //  
}

(async () => {
  console.log('aaa');

  const projectController = new ProjectController();
  projectController.init();
  const projects = projectController.getActiveProject();
})();

const projectDemo = {
  config: {
    version: '1.0.0',
    name: '',
    description: '',
    author: 'ese',
  },
  origin: [0.0, 0.0, 0.0],
  static_objects: [],
  vehicles: [],
  pedestrians: [],
  location: [0.0, 0.0, 0.0],
  test_cases: [],
  map: null,
  model: null,
  cases: null,
}
// JSON.stringify(projectDemo,null,2);
