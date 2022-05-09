import * as CANNON from "cannon-es"



export default class PhysicsEngine {
  constructor() {
    this.world  = new CANNON.World()
    this.world.gravity.set(0, -20, 0)
    
    this.world.allowSleep = true;
    this.world.defaultContactMaterial.friction=0;
    //this.world.broadphase = new CANNON.NaiveBroadphase()
    //this.world.broadphase.useBoundingBoxes=true
    //this.world.tolerance=1
    
    //temp floor 
      const groundShape = new CANNON.Box(new CANNON.Vec3(20,10,20))
    const groundBody = new CANNON.Body({ mass: 0, position:new CANNON.Vec3(0,-10,0) })
    groundBody.addShape(groundShape)
    //groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    //this.world.addBody(groundBody)
  }
  
  addBox(position,size,rotation,isStatic=false) {
    const shape = new CANNON.Box(new CANNON.Vec3(size.width/2, size.height/2, size.depth/2))
    const body = new CANNON.Body({
      mass: isStatic?0:1,
      position:new CANNON.Vec3(position.x,position.y+size.height/2,position.z)
    })
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),rotation)
    body.addShape(shape)
    body.sleepSpeedLimit = 0.1 // Body will feel sleepy if speed<1 (speed == norm of velocity)
    body.sleepTimeLimit = 0.5 // Body falls asleep after 1s of sleepiness
    
    this.world.addBody(body)
    
    return body;
  }
  
  
  update(delta) {
    this.world.fixedStep();
  }
}