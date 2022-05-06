

export default class LevelObject {
  
  constructor(position,rotation) {
    this._position=position;
    this._rotation=rotation;
  }
  
  get position() {
    return this._position;
  }
  
  set position(value) {
    
    this._position=value
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
  
}