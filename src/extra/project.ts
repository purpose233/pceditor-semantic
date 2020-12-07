import path from 'path';
import { RenderNode } from '../render/renderNode';
import { ProjectController, ProjectInfo } from './projectController';
import uuid4 from 'uuid/v4';

class ItemController {

  private projectContainer: HTMLElement = document.getElementById('projectContainer') as HTMLElement;
  private addProjectBtn: HTMLElement = document.getElementById('btnAddProject') as HTMLElement;

  private projectController: ProjectController;

  constructor(projectController: ProjectController) {
    this.projectController = projectController;
  }

  public init() {
    for (const project of this.projectController.getProjects()) {
      this.addProject(project);
    }
  }

  public updateProjects(): void {}

  public addProject(project: ProjectInfo): void {
    const isActive = this.projectController.getActiveProject() === project;
    const div = document.createElement('div');
    div.innerHTML = `
<div class="card-item project-item card">
  <div class="card-body">
    <div class="form-group row">
      <label for="project-name0" class="col-sm-2 col-form-label">项目名称：</label>
      <div class="col-sm-10">
        <input type="text" readonly class="form-control" value="${project.getName()}">
      </div>
    </div>
    <div class="form-group row">
      <label for="project-state0" class="col-sm-2 col-form-label">项目状态：</label>
      <div class="col-sm-10">
        <input type="text" readonly class="form-control-plaintext" value="${project.getStatus()}">
      </div>
    </div>
    ${
      !isActive
      ? `<button type="button" class="btn btn-primary btn edit-btn">
          <i class="iconfont">&#xe62b;</i>
          开始编辑
        </button>
        <button type="button" class="btn btn-danger btn delete-btn">
          <i class="iconfont">&#xe62c;</i>
          删除项目
        </button>
        `
      : ''
    }
  </div>
</div
    `;
    const item = div.childNodes[1] as HTMLElement;
    this.projectContainer.appendChild(item);
    if (!isActive) {
      const editBtn = (item as HTMLElement).getElementsByClassName('edit-btn')[0] as HTMLElement;
      editBtn.addEventListener('click', () => {
        this.projectController.setActiveProject(project);
        this.projectController.writeProjects();
        window.location.href="./pceditor.html";
      });
    }
  }

  public deleteProject(project: ProjectInfo): void {}
}


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
  console.log(uuid4);

  const projectController = new ProjectController();
  projectController.init();
  console.log(projectController);
  // const projects = projectController.getActiveProject();
  const itemController = new ItemController(projectController);
  itemController.init();
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
