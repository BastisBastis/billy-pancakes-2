import PhysicsBody from "../PhysicsBody"
import * as CANNON from "cannon-es"

export default class Muncher1Physics extends PhysicsBody {
  
  constructor(world,position,size,rotation,parent) {
      super(world,position,size,rotation,false)
      //this.angularDamping=0.3
      this.body.parent=parent
    }
    
  setTrapped() {
    console.log("trapped")
  }
  
  update(delta) {
    
    //this.body.applyForce(new CANNON.Vec3(0,-50,0),new CANNON.Vec3(0,0,0))
    super.update(delta)
  }
}