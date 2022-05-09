import FloorGraphics from "../../graphics/levelObjects/Floor"
import FloorPhysics from "../../physics/objects/Floor"

export default class Floor {
  constructor ({
    graphicsScene,
    physicsWorld,
    size={x:8,y:8,z:8},
    position={x:0,y:0,z:0}
  }) {
    size.y=4
    //position.y-=size.y/2
    this.graphics=new FloorGraphics(graphicsScene,size,position)
    this.physics=new FloorPhysics(physicsWorld,size,position)
    
    
  }
}