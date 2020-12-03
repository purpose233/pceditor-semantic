import { Unit } from "./unit";
import uuid from 'uuid/v4'
import { Opening } from "./opening";

export class Relation {
  private id: string = uuid();
  private unit0: Unit | null = null;
  private unit1: Unit| null = null;
  private opening: Opening | null = null;
  private direction: 'both' | 'unit0-1' | 'unit1-0' = 'both';
  private cost: number = 0;

  constructor(id?: string) {
    this.id = id ? id : uuid();
  }

  public getID(): string { return this.id; }
  public setUnit0(unit: Unit): void { this.unit0 = unit; }
  public getUnit0(): Unit | null { return this.unit0; }
  public setUnit1(unit: Unit): void { this.unit1 = unit; }
  public getUnit1(): Unit | null { return this.unit1; }
  public setOpening(opening: Opening): void { this.opening = opening; }
  public getOpening(): Opening { return this.opening as Opening; }
  public setCost(cost: number): void { this.cost = cost; }
  public getCost(): number { return this.cost; }
  public setDirection(direction: 'both' | 'unit0-1' | 'unit1-0'): void { this.direction = direction; }
  public getDirection(): 'both' | 'unit0-1' | 'unit1-0' { return this.direction; }
}