import PlayerModel from "../graphics/PlayerModel"
import EventCenter from "../helpers/EventCenter"

export default class Player {
  
  constructor ({
    graphicsEngine,
    physicsEngine,
    position={x:0,y:0,z:0},
    rotation=0,
    onLoad=()=>false
  }) {
    this.graphics= new PlayerModel({
      graphicsEngine:graphicsEngine,
      position:position,
      rotation:rotation
    });
    this.position=position;
    this.rotation=rotation;
    
    this._isRunning=false;
    this.turnFactor=0;
    
    this.runSpeed=0.05;
    this.turnSpeed=0.05;
    
    this.size={
      width:0.8,
      depth:0.8,
      height:4.2
    }
    
    this.setupPhysicsBody(physicsEngine,graphicsEngine)
    
    EventCenter.on("controlsUpdated",values=>this.updateControls(values))
  }
  
  setupPhysicsBody(physicsEngine,graphicsEngine) {
    
    this.physicsBody = physicsEngine.addBox(
      this.position,
      this.size,
      this.rotation,
      false
    )
    if (true) {
      this.physicsGraphics=graphicsEngine.addBox(
        this.position,
        this.size,
        this.rotation
        
      );
    }
  }
  
  get isRunning() {
    return this._isRunning;
  }
  
  set isRunning(value) {
    if (value!==this._isRunning) {
      this._isRunning=value;
      this.graphics.isRunning=value;
    }
  }
  
  updateControls(values){
    this.isRunning=values.y;
    this.turnFactor=values.x;
    
  }
  
  update(delta) {
    
    this.physicsBody.velocity.set()
    
    
    this.rotation+=this.turnFactor*this.turnSpeed;
    if (this.isRunning) {
      this.position.x+=this.runSpeed*Math.cos(this.rotation)
    this.position.z+=this.runSpeed*Math.sin(this.rotation)
    }
    
    
    
    this.graphics.update(delta,{
      x:this.position.x,
      y:this.position.y,
      z:this.position.z,
      rotation:this.rotation
    })
  }
  
}