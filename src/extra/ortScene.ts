import { Scene, OrthographicCamera, PerspectiveCamera,
  WebGLRenderer, Color, AxesHelper, Vector3, Points } from 'three';
import Stats from 'stats.js';
import { PCRenderer } from '../render/renderer';
import { TrackballControls } from '../../lib/TrackballControls';

export class PCScene {

  private canvas: HTMLCanvasElement;
  private container: HTMLElement;

  private scene: Scene;
  private camera: OrthographicCamera;
  private renderer: WebGLRenderer;
  private stats: Stats;
  private pcRenderer: PCRenderer;
  private isEnabled: boolean = true;
  private controls: TrackballControls;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement, renderer: PCRenderer) {
    this.container = container;
    this.canvas = canvas;
    this.scene = new Scene();
    // this.camera = new OrthographicCamera(-container.clientWidth /2, container.clientWidth / 2,
    //   -container.clientHeight / 2, container.clientHeight / 2, 1, 10000);
    // this.camera = new OrthographicCamera(-10, 10, -10, 10, 1, 10000);
    const bboxMin = renderer.getBBox().getMin();
    const bboxMax = renderer.getBBox().getMax();
    const bboxCenter = renderer.getBBox().getCenter();
    const bboxX = bboxMax.x - bboxMin.x;
    const bboxY = bboxMax.y - bboxMin.y;
    this.camera = new OrthographicCamera(bboxX / -2, bboxX / 2, bboxY / -2, bboxY / 2, 1, 10000);
    this.camera.position.set(0, 0, 0);
    // this.camera.position.set(bboxCenter.x, bboxCenter.y, bboxMin.z);
    // this.camera.position.set(bboxCenter.x, bboxCenter.y, -1);
    // this.camera.lookAt(this.scene.position);
    // this.camera.lookAt(bboxCenter.x, bboxCenter.y, bboxCenter.z);
    // this.camera.position.set(0, 0, -1);
    // this.camera.lookAt(bboxCenter.x, bboxCenter.y, bboxCenter.z);
    this.camera.lookAt(this.scene.position);
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrix();
    this.pcRenderer = renderer;

    const context = canvas.getContext('webgl2') as WebGLRenderingContext;
    this.renderer = new WebGLRenderer({canvas: canvas, context: context});
    // this.renderer = new WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setClearColor(new Color(0xaaaaaa));
    // container.appendChild(this.renderer.domElement);

    this.stats = new Stats();
    this.stats.dom.style.left = '280px';
    this.stats.dom.style.top = '10px';
    container.appendChild(this.stats.dom);
    // Trackball Controls
    this.controls = new TrackballControls(this.camera, canvas.parentElement as HTMLElement);

    window.addEventListener('resize', this.onWindowResize, false);

    // const gridHelper = new GridHelper(10, 10, new Color(0xffffff));
    // this.scene.add(gridHelper);
    // const axesHelper = new AxesHelper(10);
    // this.scene.add(axesHelper);

    // this.animate();
    this.render();
  }

  public getSceneBounding() {
    const bboxMin = this.pcRenderer.getBBox().getMin();
    const bboxMax = this.pcRenderer.getBBox().getMax();
    const bboxCenter = this.pcRenderer.getBBox().getCenter();
    const bboxX = bboxMax.x - bboxMin.x;
    const bboxY = bboxMax.y - bboxMin.y;
    return {
      minX: bboxMin.x,
      maxX: bboxMax.x,
      totalX: bboxX,
      minY: bboxMin.y,
      maxY: bboxMax.y,
      totalY: bboxY,
    };
  }

  public getCanvasSize() {
    return {
      width: this.canvas.width,
      height: this.canvas.height,
    };
  }

  public drop(container: HTMLElement): void {
    // stop animation
    this.isEnabled = false;
    this.renderer.clear();

    // remove stats
    this.stats.end();
    container.removeChild(this.stats.dom);
  }

  public getScene(): Scene { return this.scene; }

  public getCamera(): OrthographicCamera { return this.camera; }

  private onWindowResize = async () => {
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    // this.controls.handleResize();
    await this.render();
  }

  private animate = async () => {
    if (!this.isEnabled) { return; }
    this.controls.update();
    this.stats.update();
    await this.render();
    requestAnimationFrame(this.animate);
  }

  private render = async () => {
    // Used for debugging
    // if (this.flag) {
    //   await this.pcRenderer.renderTree(this.scene, this.camera);
    // }
    // this.flag = false;
    // const camera = new PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 1, 10000);
    await this.pcRenderer.renderTree(this.scene, this.camera as any);
    this.adjustPointsPosition();
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrix();
    this.renderer.render(this.scene, this.camera);
  }

  private adjustPointsPosition() {
    const bboxMin = this.pcRenderer.getBBox().getMin();
    const bboxMax = this.pcRenderer.getBBox().getMax();
    const bboxCenter = this.pcRenderer.getBBox().getCenter();
    const bboxX = bboxMax.x - bboxMin.x;
    const bboxY = bboxMax.y - bboxMin.y;
    this.scene.children.forEach(mesh => {
      if (mesh instanceof Points) {
        mesh.translateX(-bboxCenter.x);
        mesh.translateY(-bboxCenter.y);
        // mesh.translateZ(-bboxCenter.z);
      }
    })
  }
}
