import PlayerModel from "../graphics/PlayerModel"
import EventCenter from "../helpers/EventCenter"

import PhysicsBody from "../physics/PhysicsBody"

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
    
    this.runSpeed=10;
    this.turnSpeed=0.04;
    
    this.jumpVelocity=10;
    
    this.size={
      width:1,
      depth:1,
      height:5.6
    }
    
    this.setupPhysicsBody(physicsEngine,graphicsEngine)
    
    EventCenter.on("controlsUpdated",values=>this.updateControls(values))
    EventCenter.on("jump",()=>this.jump())
  }
  
  setupPhysicsBody(physicsEngine,graphicsEngine) {
    
    this.physicsBody = PhysicsBody.getBody(
      physicsEngine.world,
      this.position,
      this.size,
      this.rotation,
      false
    )
    
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
  
  jump() {
    console.log(this.position)
    const couldJump = this.physicsBody.jump(this.jumpVelocity);
    if (couldJump) {
      this.graphics.jump()
    }
  }
  
  updateControls(values){
    this.isRunning=values.y;
    this.turnFactor=values.x;
    
  }
  
  update(delta) {
    
    //this.physicsBody.angularVelocity=this.turnFactor*this.turnSpeed;
    this.physicsBody.rotation+=this.turnFactor*this.turnSpeed;
    this.physicsBody.velocity=this.isRunning?this.runSpeed:0;
    this.physicsBody.update(delta)
    /*
    this.rotation+=this.turnFactor*this.turnSpeed;
    if (this.isRunning) {
      this.position.x+=this.runSpeed*Math.cos(this.rotation)
    this.position.z+=this.runSpeed*Math.sin(this.rotation)
    }
    
    */
    
    this.rotation=this.physicsBody.rotation;
    this.position=this.physicsBody.position;
    
    this.graphics.update(delta,{
      x:this.position.x,
      y:this.position.y,
      z:this.position.z,
      rotation:this.rotation
    })
    
    
    /*
    this.physicsGraphics.setRotation(this.rotation)
    this.physicsGraphics.setPosition(this.position.x,this.position.y,this.position.z)
    */
  }
  
}