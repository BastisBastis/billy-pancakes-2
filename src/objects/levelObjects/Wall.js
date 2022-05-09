import WallGraphics from "../../graphics/levelObjects/Wall"
import WallPhysics from "../../physics/objects/Wall"

export default class Wall {
  constructor ({
    graphicsScene,
    physicsWorld,
    size={x:8,y:8,z:8},
    position={x:0,y:0,z:0},
    rotation=0
  }) {
    size.z=1
    //position.y-=size.y/2
    this.graphics=new WallGraphics(graphicsScene,size,position,rotation)
    this.physics=new WallPhysics(physicsWorld,size,position,rotation)
    
    
  }
}