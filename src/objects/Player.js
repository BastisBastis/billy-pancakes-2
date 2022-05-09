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
    this._isWalking=false;
    this._speed=0;
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
  
  get isWalking() {
    return this._isWalking;
  }
  
  set isWalking(value) {
    if (value!==this._isWalking) {
      this._isWalking=value;
      this.graphics.isWalking=value;
    }
  }
  
  set speed(value) {
    this._speed=value;
    
    this.graphics.movement= Math.ceil(value*2)
    
  }
  
  get speed() {
    return this._speed;
  }
  
  jump() {
    console.log(this.position)
    const couldJump = this.physicsBody.jump(this.jumpVelocity);
    if (couldJump) {
      this.graphics.jump()
    }
  }
  
  updateControls(values){
    if (!isNaN(values.y))
      this.speed=values.y;
    if (!isNaN(values.x))
      this.turnFactor=values.x;
    
  }
  
  update(delta) {
    
    
    this.physicsBody.rotation+=this.turnFactor*this.turnSpeed*(1-this.speed/2);
    this.physicsBody.velocity=this.speed*this.runSpeed;
    this.physicsBody.update(delta)
    
    
    this.rotation=this.physicsBody.rotation;
    this.position=this.physicsBody.position;
    
    this.graphics.update(delta,{
      x:this.position.x,
      y:this.position.y,
      z:this.position.z,
      rotation:this.rotation
    })
    
    
    
  }
  
}