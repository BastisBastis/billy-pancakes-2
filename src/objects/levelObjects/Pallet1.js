import LevelObject from "./LevelObject"

import Pallet1Graphics from "../../graphics/levelObjects/Pallet1"
import Pallet1Physics from "../../physics/objects/Pallet1"

export default class Pallet1 extends LevelObject {
    constructor({
      graphicsScene, 
      physicsWorld, 
      position, 
      rotation, 
      scale={xz:1, y:1},
      onLoad
    }) {
      
      super(position,rotation)
        this.graphics = new Pallet1Graphics(graphicsScene, position, rotation, scale,onLoad);
        this.physics = new Pallet1Physics(physicsWorld, position, rotation, scale);
      
    }
  
}