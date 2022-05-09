import * as CANNON from "cannon-es"

export default class PhysicsBody {
  constructor(world, body,size,rotation) {
    this.size=size
    
    body.sleepSpeedLimit = 0.1 // Body will feel sleepy if speed<1 (speed == norm of velocity)
    body.sleepTimeLimit = 30.5 // Body falls asleep after 1s of sleepiness
    
    this.body=body;
    this.rotation=rotation
    world.addBody(body);
    
  
  }
  
  static getBody(world,position,size,rotation,isStatic) {
    const shape = new CANNON.Box(new CANNON.Vec3(size.width/2, size.height/2, size.depth/2))

    const body = new CANNON.Body({
      mass: isStatic?0:1,
      position:new CANNON.Vec3(
        position.x,
        position.y+size.height/2,
        position.z)
    })
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),rotation)
    body.angularDamping=1;
    
    body.addShape(shape)
    
    
    
    return new PhysicsBody(world,body,size,rotation)
  }
  
  set angularVelocity(vel) {
    this.body.angularVelocity.set(0,vel,0)
  }
  /*
  get rotation() {
    return this.rotation;
    
    const targetVec=new CANNON.Vec3(0,0,0)
    
    this.body.quaternion.toEuler(targetVec);
    
    return targetVec.y
    
  }
  */
  
  set velocity(vel) {
    
    
    
    this.body.velocity.x=vel*Math.cos(this.rotation)
    this.body.velocity.z=vel*Math.sin(this.rotation)
    
    
    
  }
  
  jump(vel) {
    this.body.velocity.y=vel
    return true
  }
  
  get position() {
    const position=this.body.position.clone()
    
    return {
      x:position.x,
      y:position.y-this.size.height/2,
      z:position.z
      }
  }
  
  update(delta) {
    if (this.body.velocity.y>0){
      this.body.applyForce(new CANNON.Vec3(0,10,0),new CANNON.Vec3(0,0,0))
    }
  }
}