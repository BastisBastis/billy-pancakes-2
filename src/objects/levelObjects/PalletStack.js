import Pallet1 from "./Pallet1"
import LevelObject from "./LevelObject"
import Delaunator from "delaunator"

import PalletStackGraphics from "../../graphics/levelObjects/PalletStack"

const rotatedCorner=(cx,cy,cz,dx,dy,dz,theta) =>{
  
  
  const rotatedX=dx*Math.cos(theta)-dz*Math.sin(theta);
  const rotatedZ=dx*Math.sin(theta)+dz*Math.cos(theta);
  
  const res={
    x:cx+rotatedX,
    y:cy,
    z:cz+rotatedZ
  }
  
  return res
}

export default class PalletStack  extends LevelObject {
  //Should update for pnlu one physics body
  constructor({
    graphicsScene, 
    physicsWorld, 
    position,
    rotation, 
    scale={xz:1, y:1},
    count=4,
    rotationRandomness=0.2,
    onLoad
    
    }) {
      
      
      
      super(position,rotation)
      this.pallets=[]
      this.palletsToLoad=count;
      this.onLoad=onLoad
      
      const rotations=[]
      
      
      for (let i=0;i<count;i++) {
        const pos={x:position.x,y:position.y+0.8*i*scale.y,z:position.z}
        this.pallets.push(new Pallet1({
          graphicsScene:graphicsScene, 
    physicsWorld:physicsWorld, 
    position:pos,
    rotation:rotation+Math.random()*rotationRandomness-rotationRandomness/2, 
    scale:scale,
    onLoad:()=>this.loadedPallet()
        }))
      }
    
    const palletGraphics=this.pallets.map(pallet=>pallet.graphics)
    
    //console.log(palletGraphics)
    
    this.palletStackGraphics= new PalletStackGraphics(graphicsScene,palletGraphics)
    
    this.setNavVerts(position,rotation)
      
    }
    
  loadedPallet() {
    this.palletsToLoad--;
    if (this.palletsToLoad===0)
      this.onLoad()
  }
  
  setNavVerts(pos,rot) {
    const w=8
    const d=8
    const iw=3.5;
    const id=5;
    
    
    
      let tl=rotatedCorner(
        pos.x,
        pos.y,
        pos.z,
        -iw/2,
        0,
        id/2,
        -rot
        )
      let tr=rotatedCorner(
        pos.x,
        pos.y,
        pos.z,
        iw/2,
        0,
        id/2,
        -rot
        )
      let bl=rotatedCorner(
        pos.x,
        pos.y,
        pos.z,
        -iw/2,
        0,
        -id/2,
        -rot
        )
      let br=rotatedCorner(
        pos.x,
        pos.y,
        pos.z,
        iw/2,
        0,
        -id/2,
        -rot
        )
        
      
    
      let otl={
        x:pos.x-w/2,
        y:pos.y,
        z:pos.z+w/2
      }
      let otr={
        x:pos.x+w/2,
        y:pos.y,
        z:pos.z+w/2
      }
      let obl={
        x:pos.x-w/2,
        y:pos.y,
        z:pos.z-w/2
      }
      let obr={
        x:pos.x+w/2,
        y:pos.y,
        z:pos.z-w/2
      }
      
      const verts2d=[
      	 [br.x, br.z],
      	 [bl.x, bl.z],
      	 [tr.x, tr.z],
      
      	 [tl.x, tl.z],
      	 [tr.x, tr.z],
      	 [bl.x, bl.z],
      	 
      	 [obr.x, obr.z],
      	 [obl.x, obl.z],
      	 [otr.x, otr.z],
      
      	 [otl.x, otl.z],
      	 [otr.x, otr.z],
      	 [obl.x, obl.z],
        ]
      
      const delaunay = Delaunator.from(verts2d)
      
      const coordinates=[]
      for (let i = 0; i < delaunay.triangles.length; i += 3) {
    coordinates.push([
        verts2d[delaunay.triangles[i]],
        verts2d[delaunay.triangles[i + 1]],
        verts2d[delaunay.triangles[i + 2]]
    ]);
}
    
    const avoid=[3,4]
      let verts=[]
      
      coordinates.forEach((tri,i)=>{
        if (avoid.includes(i))
          return false
        tri.forEach(point=>{
          verts=[
            ...verts,
            point[0],
            pos.y,
            point[1]
          ]
        })
      })
      /*
      const verts=[
      	 br.x, br.y,  br.z,
      	 bl.x, bl.y,  bl.z,
      	 tr.x, tr.y, tr.z,
      
      	 tl.x, tl.y,  tl.z,
      	 tr.x, tr.y,  tr.z,
      	 bl.x, bl.y,  bl.z,
      	 
      	 obr.x, obr.y,  obr.z,
      	 obl.x, obl.y,  obl.z,
      	 otr.x, otr.y,  otr.z,
      
      	 otl.x, otl.y,  otl.z,
      	 otr.x, otr.y,  otr.z,
      	 obl.x, obl.y,  obl.z,
        ]
      */
        
        
        
      this.navVertCollections.push({
        vertY:pos.y+2,
        itemPos:pos,
        vertices:[...verts]
      })
      
      
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