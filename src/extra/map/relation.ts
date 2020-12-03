import { Unit } from "./unit";
import uuid from 'uuid/v4'

export class Relation {
  private id: string = uuid();
  // private unit0: Unit;
  // private unit0: Unit;
  // private opening: Opening;
  // private cost: number;

  public getID(): string { return this.id; }
}