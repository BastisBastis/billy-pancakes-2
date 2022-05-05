import * as CANNON from "cannon-es"

export default class PhysicsBody {
  constructor(world, body) {
    this.body=body;
    world.add(body);
  }
  
  static getBox(world,position,size,rotation,isStatic) {
    
  }
}