import Pallet1 from "./Pallet1"
import LevelObject from "./LevelObject"
import Delaunator from "delaunator"





export default class PalletWall  extends LevelObject {
  //Should update for pnlu one physics body
  constructor({
    graphicsScene, 
    physicsWorld, 
    position,
    rotation, 
    scale={xz:1, y:1},
    count=4,
    
    
    }) {
      super(position,rotation)
      this.pallets=[]
      
      
      const positions=[
        {
          x:position.x+8*(1/3),
          z:position.z-2
        },
        {
          x:position.x,
          z:position.z-2
        },
        {
          x:position.x-8*(1/3),
          z:position.z-2
        },
        {
          x:position.x+8*(1/3),
          z:position.z+2
        },
        {
          x:position.x,
          z:position.z+2
        },
        {
          x:position.x-8*(1/3),
          z:position.z+2
        },
      ]
      
      for (let i=0;i<count;i++) {
        positions.forEach(pos2d=>{
          const pos={x:pos2d.x,y:position.y+0.8*i*scale.y,z:pos2d.z}
        this.pallets.push(new Pallet1({
          graphicsScene:graphicsScene, 
    physicsWorld:physicsWorld, 
    position:pos,
    rotation:0, 
    scale:scale
        }))
        })
        
      }
    
    
    
    //console.log(palletGraphics)
    
    
    
    this.setNavVerts(position,rotation)
      
    }
  
  setNavVerts(pos,rot) {
    /*
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
      
      
      */
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
        
        /*
        
      this.navVertCollections.push({
        vertY:pos.y+2,
        itemPos:pos,
        vertices:[...verts]
      })
      
      */
    }
    
}