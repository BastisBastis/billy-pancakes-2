import LevelObject from "./LevelObject"

import RampGraphics from "../../graphics/levelObjects/Ramp"
import RampPhysics from "../../physics/objects/Ramp"

export default class Ramp extends LevelObject {
    constructor({graphicsScene, physicsWorld, position, rotation, scale={xz:1, y:1}}) {
      
      super(position,rotation)
        this.graphics = new RampGraphics(graphicsScene, position, rotation, scale);
        this.physics = new RampPhysics(physicsWorld, position, rotation, scale);
      
    }
  
}