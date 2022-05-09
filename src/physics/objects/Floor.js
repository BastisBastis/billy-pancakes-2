import * as CANNON from "cannon-es"

export default class FloorPhysics {
  constructor(world,size,position) {
    const shape = new CANNON.Box(new CANNON.Vec3(size.x/2,size.y/2,size.z/2))
    this.body= new CANNON.Body({
      mass:0,
      position:new CANNON.Vec3(
        position.x,
        position.y-size.y/2,
        position.z
      )
    })
    this.body.addShape(shape)
    world.addBody(this.body)
  }
}