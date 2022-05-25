import LevelObject from "./LevelObject"

import RampGraphics from "../../graphics/levelObjects/Ramp"
import RampPhysics from "../../physics/objects/Ramp"

export default class Ramp extends LevelObject {
    constructor({graphicsScene, physicsWorld, position, rotation, scale={xz:1, y:1}}) {
      
      super(position,rotation)
        this.graphics = new RampGraphics(graphicsScene, position, rotation, scale);
        this.physics = new RampPhysics(physicsWorld, position, rotation, scale);
      
      
      this.setNavVerts(position,rotation)
      
    }
  
  setNavVerts(pos,rot) {
    console.log(rot)
    const w=8
    
      let tl={
        x:pos.x-w/2,
        y:pos.y+4,
        z:pos.z+w/2
      }
      let tr={
        x:pos.x+w/2,
        y:pos.y+4,
        z:pos.z+w/2
      }
      let bl={
        x:pos.x-w/2,
        y:pos.y,
        z:pos.z-w/2
      }
      let br={
        x:pos.x+w/2,
        y:pos.y+0,
        z:pos.z-w/2
      }
      
      
      
      if (rot==Math.PI) {
        
        
      } else if (rot==-Math.PI/2) {
        
      } else if (rot==0) {
        
        tl.y=pos.y
        br.y=pos.y+4
      }
      
      const rampVerts=[
      	 br.x, br.y,  br.z,
      	 bl.x, bl.y,  bl.z,
      	 tr.x, tr.y, tr.z,
      
      	 tl.x, tl.y,  tl.z,
      	 tr.x, tr.y,  tr.z,
      	 bl.x, bl.y,  bl.z
        ]
        
      this.navVertCollections.push({
        vertY:pos.y+2,
        itemPos:pos,
        vertices:[...rampVerts]
      })
      
      const fbz=pos.z-0.5
      const ftz=pos.z+2.8
      
      tl={
        x:pos.x-w/2,
        y:pos.y,
        z:ftz
      }
      tr={
        x:pos.x+w/2,
        y:pos.y,
        z:ftz
      }
      bl={
        x:pos.x-w/2,
        y:pos.y,
        z:fbz
      }
      br={
        x:pos.x+w/2,
        y:pos.y+0,
        z:fbz
      }
      
      const floorVerts=[
      	 br.x, br.y,  br.z,
      	 bl.x, bl.y,  bl.z,
      	 tr.x, tr.y, tr.z,
      
      	 tl.x, tl.y,  tl.z,
      	 tr.x, tr.y,  tr.z,
      	 bl.x, bl.y,  bl.z
        ]
      
      
      /*
      this.navVertCollections.push({
        vertY:pos.y,
        itemPos:pos,
        vertices:[...floorVerts]
      })
      */
    }
  
}