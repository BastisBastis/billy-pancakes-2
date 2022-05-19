import * as CANNON from "cannon-es"

export default class PhysicsBody {
  constructor(world,position,size,rotation,isStatic,kickBox=false) {
    
    
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
    
    const sphere= new CANNON.Sphere(size.width/2)
    
    body.addShape(shape)
    body.addShape(sphere,new CANNON.Vec3(0,-size.height/2+size.width/2,0))
    
    this.size=size
    
    body.sleepSpeedLimit = 0.1 // Body will feel sleepy if speed<1 (speed == norm of velocity)
    body.sleepTimeLimit = 30.5 // Body falls asleep after 1s of sleepiness
    
    this.body=body;
    this._rotation=rotation
    world.addBody(body);
    
    this.jumpTime=1;

    this.setupJumpingTester();
  
  
    if (kickBox) {
      const kbh=2;
      const kby=-1.5;
      const kbw=8;
      const kbd=8;
      this.kickBox= new CANNON.Body({
      mass: 0,
      position:new CANNON.Vec3(
        position.x,
        position.y,
        position.z),
      isTrigger:true
    })
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),rotation)
    this.kickBox.addShape(new CANNON.Box(new CANNON.Vec3(kbd/2,kbh/2,kbw/2)),new CANNON.Vec3(kbd/2,kby,0))
    world.addBody(this.kickBox)
    
    this.kickBox.addEventListener( "collide", (e)=>{
    
    const contact = e.contact;

    // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
    // We do not yet know which one is which! Let's check.
    const targetBody=contact.bi.id == this.kickBox.id?
      contact.bj:
      contact.bi;
      
    //console.log(targetBody.parent)

    if (targetBody.parent&&targetBody.parent.setInKickRange)
      targetBody.parent.setInKickRange()
    
  });
    }
  }
  
  getRelativePosition(worldPoint) {
    const wp=new CANNON.Vec3(worldPoint.x,worldPoint.y,worldPoint.x)
    const result=new CANNON.Vec3()
    this.kickBox.pointToLocalFrame(wp,result)
    return {
      x:result.x,
      y:result.y,
      z:result.z
    }
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
  
  set rotation(value) {
    this._rotation=value
    
    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),-value)
  }
  
  get rotation(){
    return this._rotation;
  }
  
  jump(vel) {
    if (this.canJump) {
      this.body.velocity.y=vel*1.5;
      this.jumpTime=0;
      this.canJump=false;
      return true
    }
    return false;
    
  }
  
  get position() {
    const position=this.body.position.clone()
    
    return {
      x:position.x,
      y:position.y-this.size.height/2,
      z:position.z
      }
  }
  
  set position(value) {
    this.body.position.x=value.x;
    this.body.position.y=value.y+this.size.height/2;
    this.body.position.z=value.z
    
    //console.log(this.position)
  }
  
  moveTo(target) {
    const dir={
      x:target.x-this.position.x,
      y:target.y-this.position.y,
      z:target.z-this.position.z
    }
    this.body.velocity.x=dir.x*2;
    //this.body.velocity.y=dir.y;
    this.body.velocity.z=dir.z*2
  }

  setVelocity(dir) {
    //console.log(dir)
    this.body.velocity.x=dir.x;
    this.body.velocity.y=dir.y;
    this.body.velocity.z=dir.z
  }
  setupJumpingTester() {
    // Jumping
  const contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
  const upAxis = new CANNON.Vec3( 0, 1, 0 );
  this.canJump=true;
  this.body.addEventListener( "collide", (e)=>{
    
    const contact = e.contact;

    // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
    // We do not yet know which one is which! Let's check.

    if ( contact.bi.id == this.body.id ) {
      contact.ni.negate( contactNormal );
    } // bi is the player body, flip the contact normal
    else {
      contactNormal.copy( contact.ni ); // bi is something else. Keep the normal as it is
    }

    // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
    if ( contactNormal.dot( upAxis ) > 0.5) {
      
      // Use a "good" threshold value between 0 and 1 here!
      this.canJump = true;
      
    }
    
  });
  }
  
  stop() {
    this.setVelocity({x:0,y:0,z:0})
  }
  
  update(delta) {
    if (this.kickBox) {
      this.kickBox.position.copy(this.body.position)
      this.kickBox.quaternion.copy(this.body.quaternion)
    }
    if (this.body.velocity.y>0.2){
      this.jumpTime = Math.max(this.jumpTime-delta/1000,0);
      this.body.applyForce(new CANNON.Vec3(0,40*this.jumpTime,0),new CANNON.Vec3(0,0,0))
    }
  }
}