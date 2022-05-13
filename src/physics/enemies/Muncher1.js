import PhysicsBody from "../PhysicsBody"
import * as CANNON from "cannon-es"

export default class Muncher1Physics extends PhysicsBody {
  
  update(delta) {
    this.body.applyForce(new CANNON.Vec3(0,2,0),new CANNON.Vec3(0,0,0))
  }
}