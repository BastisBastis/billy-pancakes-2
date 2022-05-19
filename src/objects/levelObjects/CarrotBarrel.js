import LevelObject from "./LevelObject"

import CarrotBarrelGraphics from "../../graphics/levelObjects/CarrotBarrel"
import CarrotBarrelPhysics from "../../physics/objects/CarrotBarrel"

export default class CarrotBarrel extends LevelObject {
    constructor({graphicsScene, physicsWorld, position, rotation=0, scale={xz:1, y:1}}) {
      
      super(position,rotation)
        this.graphics = new CarrotBarrelGraphics(graphicsScene, position, rotation, scale);
        this.physics = new CarrotBarrelPhysics(physicsWorld, position, rotation, scale);
        
      this.attraction = 30;
      
    }
  
}