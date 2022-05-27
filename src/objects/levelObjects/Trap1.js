import LevelObject from "./LevelObject"

import Trap1Graphics from "../../graphics/levelObjects/Trap1"
import Trap1Physics from "../../physics/objects/Trap1"

export default class Trap1 extends LevelObject {
    constructor({graphicsScene, physicsWorld, position, rotation=0, scale={xz:1, y:1},onLoad=()=>false}) {
      
      super(position,rotation)
        this.graphics = new Trap1Graphics(graphicsScene.scene, position, rotation, scale);
        this.physics = new Trap1Physics(physicsWorld, position, rotation, {x:4,y:2,z:4},this.graphics.vertices);
        
        onLoad()
      
    }
  
}