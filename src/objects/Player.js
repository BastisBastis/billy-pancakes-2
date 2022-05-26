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
    onLoad=()=>false,
    demo=false
  }) {
    this.demo=demo
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
    this.isPlayer=true
    
    this.runSpeed=10;
    this.turnSpeed=0.04;
    
    this.jumpVelocity=10;
    
    this.size={
      width:1,
      depth:1,
      height:5.6
    }
    
    this.attraction=20
    
    this.rabiesCount=0;
    
    this.setupPhysicsBody(physicsEngine,graphicsEngine)
    
    EventCenter.on("controlsUpdated",values=>this.updateControls(values))
    EventCenter.on("jump",()=>this.jump())
    EventCenter.on("tryKick",()=>this.kick())
    EventCenter.on("turn", data=>this.turn(data.delta))
    EventCenter.on("strafe", data=>this.physicsBody.strafe(data.dir))
  }
  
  destroy() {
    this.graphics=null;
    this.physicsBody=null;
  }
  
  turn(delta) {
    this.physicsBody.rotation+=delta/100;
  }

  getAttacked(delta) {
    this.rabiesCount+=delta/100;
    //console.log(this.rabiesCount)
    EventCenter.emit("updateRabiesCount",{rabiesCount:this.rabiesCount/100})
    
    if (this.rabiesCount>100) {
      EventCenter.emit("death")
    }
  }
  
  kick() {
    this.graphics.kick()
    const force=20
    const height=25
    setTimeout(
      ()=>{
        EventCenter.emit("kick",{
      dir:{
        x:Math.cos(this.rotation)*force,
        y:height,
        z:Math.sin(this.rotation)*force
      },
      checkKickRange:this.demo?
        (()=>true):
        (pos)=>this.checkKickRange(pos)
    })
      },
      100
    )
    
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
    
    const movementType = value<0?
      -1:
      Math.ceil(value*2);
    
    this.graphics.movement= movementType
    
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
      dist<3 &&
      Math.abs(dy)<1
    )
      return true
    
    /*
    console.log(`dRot ${dRot} < Math.PI = ${dRot<Math.PI}
    dist ${dist} < 1 = ${dist<1}
    dy ${Math.abs(dy)}<1 = ${Math.abs(dy)<1}
    `)
    */
    return false
    
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
    if (!isNaN(values.x)) {
      const val= this.speed<0?
        -values.x/2:
        values.x;
      this.turnFactor=values.x
    }
      
    
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