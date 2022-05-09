import Pallet1 from "./Pallet1"
import LevelObject from "./LevelObject"

export default class PalletStack  extends LevelObject {
  //Should update for pnlu one physics body
  constructor({
    graphicsScene, 
    physicsWorld, 
    position,
    rotation, 
    scale={xz:1, y:1},
    count=4
    
    }) {
      super(position,rotation)
      this.pallets=[]
      
      
      
      
      for (let i=0;i<count;i++) {
        const pos={x:position.x,y:position.y+0.8*i*scale.y,z:position.z}
        this.pallets.push(new Pallet1({
          graphicsScene:graphicsScene, 
    physicsWorld:physicsWorld, 
    position:pos,
    rotation:rotation, 
    scale:scale
        }))
      }
    
    }
  
  set position(value) {
    
    this._position=value
    this.graphics.forEach(obj=>obj.position=this._position)
    this.physics.forEach(obj=>obj.position=this._position)
  }
  
  
  
  set rotation(value) {
    this._rotation=value;
    this.graphics.forEach(obj=>obj.rotation=value)
    this.physics.forEach(obj=>obj.rotation=value)
  }
  
}