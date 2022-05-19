import PlayerModel from "../graphics/PlayerModel"
import EventCenter from "../helpers/EventCenter"

import PhysicsBody from "../physics/PhysicsBody"

const mod = (a, n) => (a % n + n) % n

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
    
    this.attraction=20
    
    this.setupPhysicsBody(physicsEngine,graphicsEngine)
    
    EventCenter.on("controlsUpdated",values=>this.updateControls(values))
    EventCenter.on("jump",()=>this.jump())
    EventCenter.on("tryKick",()=>this.kick())
    
  }
  
  kick() {
    this.graphics.kick()
    const force=15
    const height=20
    EventCenter.emit("kick",{
      dir:{
        x:Math.cos(this.rotation)*force,
        y:height,
        z:Math.sin(this.rotation)*force
      },
      checkKickRange:(pos)=>this.checkKickRange(pos)
    })
  }
  
  setupPhysicsBody(physicsEngine,graphicsEngine) {
    
    this.physicsBody = new PhysicsBody(
      physicsEngine.world,
      this.position,
      this.size,
      this.rotation,
      false,
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
  
  checkKickRange(pos) {
    try { 
    
    const angleToTarget=Math.atan2(pos.z-this.position.z,pos.x-this.position.x)
    let dRot=Math.abs(angleToTarget-this.rotation)
    dRot=mod((dRot + Math.PI) , Math.PI*2) - Math.PI
    
    
    const dx=pos.x-this.position.x;
    const dy=pos.y-this.position.y;
    const dz=pos.z-this.position.z
    
    const dist = Math.sqrt(dx*dx+dz*dz)
    
    
    if (
      dRot<Math.PI &&
      dist<1 &&
      Math.abs(dy)<1
    )
      return true
    
    console.log(`dRot ${dRot} < Math.PI = ${dRot<Math.PI}
    dist ${dist} < 1 = ${dist<1}
    dy ${Math.abs(dy)}<1 = ${Math.abs(dy)<1}
    `)
    return false
    /*
    console.log(pos)
    const relativePos1=this.physicsBody.getRelativePosition(pos)
    const relativePos2=this.graphics.getRelativePosition(pos)
    console.log("rel pos:",relativePos1,relativePos2)
    //x and z are switched
    
    const relativePos=relativePos2
    if (
      relativePos.x>0 &&
      relativePos.x<4 &&
      relativePos.y>-4 &&
      relativePos.y<2 &&
      relativePos.z>-3 &&
      relativePos.z<3
    )
      return true
      
      */
    return false
    
    } catch (er) {console.log(er.message)} 
  }
  
  get speed() {
    return this._speed;
  }
  
  jump() {
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
    EventCenter.emit("updatePlayerPosition",{position:this.position})
    
    
  }
  
}