import { Vector2 } from "three";

let pointID = 0;

const MinHoverDistance = 5;

export class Point {

  private id: number = pointID++;
  // private refItem: 
  private position: Vector2;

  public getID(): number { return this.id; }
  
  constructor(position?: Vector2) {
    this.position = position ? position.clone() : new Vector2(0, 0);
  }

  public getPosition(): Vector2 {
    return this.position;
  }

  public checkHovered(position: Vector2): boolean {
    const distance = position.distanceTo(this.position);
    return distance <= MinHoverDistance;
  }

  public setPosition(position: Vector2): void {
    this.position.set(position.x, position.y);
  }
}