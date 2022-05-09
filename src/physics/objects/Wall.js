import * as CANNON from "cannon-es"

export default class WallPhysics {
  constructor(world,size,position,rotation) {
    const shape = new CANNON.Plane()
    this.body= new CANNON.Body({
      mass:0,
      position:new CANNON.Vec3(
        position.x,
        position.y+size.y/2,
        position.z
      )
    })
    this.body.addShape(shape)
    this.body.quaternion.setFromEuler(0,rotation,0,"XYZ")
    world.addBody(this.body)
  }
}