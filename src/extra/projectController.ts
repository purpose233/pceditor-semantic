import path from 'path';
import fs from 'fs';
import { Vector2 } from 'three';

export class ProjectInfo {
  private id: string;
  private name: string;
  private path: string;
  private status: string;
  private isActive: boolean;
  private plyPath: string = './meta.ply';
  private pcdPath: string = './meta.pcd';
  private specPath: string = './project.json';

  constructor(
    id: string,
    name: string,
    path: string,
    status: string,
    isActive: boolean
  ) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.status = status;
    this.isActive = isActive;
  }

  public getID(): string { return this.id; }
  public getName(): string { return this.name; }
  public getPath(): string { return this.path; }
  public getStatus(): string { return this.status; }
  public getIsActive(): boolean { return this.isActive; }
  public getPLYPath(): string { return this.plyPath; }
  public getPCDPath(): string { return this.pcdPath; }
  public getSpecPath(): string { return this.specPath; }
  public setName(name: string): void { this.name = name; } 
  public setStatus(status: string): void { this.status = status; } 
  public setActive(active: boolean): void { this.isActive = active; } 
}

// interface SceneMap {

// }

interface TestCase {
  egoStart: Vector2;
  egoEnd: Vector2;
  collision: boolean;
  timeout: boolean;
  order: boolean;
  path: Vector2[];
  type: 'cover' | 'arrive';
  // agent
  // trigger
  // extension
}

// interface ProjectSpec {
//   info: ProjectInfo;
//   map: SceneMap;
//   cases: TestCase;
// }

export class ProjectController {

  private rootPath: string = path.resolve(__dirname, '../../build/projects');
  private configPath: string = path.resolve(this.rootPath, './config.json');

  private projects: ProjectInfo[] = [];
  
  public init(): void {
    this.readProjects();
  }

  public readProjects(): void {
    this.projects = [];
    const config: any = JSON.parse(
      fs.readFileSync(this.configPath, { encoding: 'utf-8' })
    );
    for (const info of config.projects) {
      this.projects.push(new ProjectInfo(
        info.id,
        info.name,
        info.path,
        info.status,
        info.isActive,
      ));
    }
  }

  public writeProjects(): void {
    const config = {
      projects: this.projects.map(project => {
        return {
          id: project.getID(),
          name: project.getName(),
          path: project.getPath(),
          status: project.getStatus(),
          isActive: project.getIsActive(),
        };
      })
    };
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), { encoding: 'utf-8' });
  }

  public getProjects(): ProjectInfo[] { return this.projects; }
  
  public getActiveProject(): ProjectInfo | undefined {
    return this.projects.find((project: ProjectInfo) => {
      return project.getIsActive();
    });
  }

  public setActiveProject(project: ProjectInfo): void {
    this.projects.forEach(project => { project.setActive(false); });
    project.setActive(true);
    
  }

  public getActiveProjectPath(): string {
    const project = this.getActiveProject();
    return project ? path.resolve(this.rootPath, project.getPath()) : '';
  }
  public getActivePLYPath(): string {
    const project = this.getActiveProject();
    return project ? path.resolve(this.rootPath, project.getPath(), project.getPLYPath()) : '';
  }
  public getActivePCDPath(): string {
    const project = this.getActiveProject();
    return project ? path.resolve(this.rootPath, project.getPath(), project.getPCDPath()) : '';
  }
  public getActiveSpecPath(): string {
    const project = this.getActiveProject();
    return project ? path.resolve(this.rootPath, project.getPath(), project.getSpecPath()) : '';
  }
}
