import LevelObject from "./LevelObject"

import Platform1Graphics from "../../graphics/levelObjects/Platform1"
import Platform1Physics from "../../physics/objects/Platform1"

export default class Platform1 extends LevelObject {
    constructor({graphicsScene, physicsWorld, position, rotation, scale={xz:1, y:1}}) {
      super(position,rotation)
        this.graphics = new Platform1Graphics(graphicsScene, position, rotation, scale);
        this.physics = new Platform1Physics(physicsWorld, position, rotation, scale);
      
    }
  /*
  get position() {
    return this._position;
  }
  
  set position(a,b,c) {
    let x,y,z;
    if (typeof(a)=="Object") {
      {x,y,z} = a;
    } else {
      x=a;
      y=b;
      z=c;
    }
    this._position={x:x,y:y,z:z}
    this.graphics.position=this._position;
    this.physics.position=this._position;
  }
  
  get rotation() {
    return this._rotation;
  }
  
  set rotation(value) {
    this._rotation=value;
    this.graphics.rotation=value;
    this.physics.rotation=value;
  }
  */
}