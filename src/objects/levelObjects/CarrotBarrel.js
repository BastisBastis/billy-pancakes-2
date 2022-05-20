import LevelObject from "./LevelObject"

import CarrotBarrelGraphics from "../../graphics/levelObjects/CarrotBarrel"
import CarrotBarrelPhysics from "../../physics/objects/CarrotBarrel"

import Delaunator from "delaunator"

import EventCenter from "../../helpers/EventCenter"

const rotatedCorner=(cx,cy,cz,dx,dy,dz,theta) =>{
  
  
  const rotatedX=dx*Math.cos(theta)-dz*Math.sin(theta);
  const rotatedZ=dx*Math.sin(theta)+dz*Math.cos(theta);
  
  const res={
    x:cx+rotatedX,
    y:cy,
    z:cz+rotatedZ
  }
  //console.log(res)
  return res
}

export default class CarrotBarrel extends LevelObject {
    constructor({graphicsScene, physicsWorld, position, rotation=0, scale={xz:1, y:1},index=0}) {
      
      super(position,rotation)
      this.graphics = new CarrotBarrelGraphics(graphicsScene, position, rotation, scale,index,this);
      this.physics = new CarrotBarrelPhysics(physicsWorld, position, rotation, scale);
        
      this.attraction = 30;
      this.carrotCount=100
      this.index=index
     
    //this.setNavVerts(position,rotation)
      
  }
  
  destroy() {
    this.attraction=-10;
    this.graphics.destroy()
    EventCenter.emit("updateAttractionPosition",{
        destroyed:true
      })
  }
  
  getAttacked(delta) {
    if (this.carrotCount>0) {
      this.carrotCount-=delta/100
      if (this.carrotCount<=0) {
        this.destroy()
      }
    }
        
    
  }
  
  setNavVerts(pos,rot) {
    const w=8
    const d=8
    const ir=3;
    
    
    
    
      
      
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
      	
      	 [obr.x, obr.z],
      	 [obl.x, obl.z],
      	 [otr.x, otr.z],
      
      	 [otl.x, otl.z],
      	 [otr.x, otr.z],
      	 [obl.x, obl.z],
        ]
        
        const theta=Math.PI/4
        
        for (let i=0;i<Math.PI*2;i+=theta) {
          const point=rotatedCorner(
            pos.x,
            pos.y,
            pos.z,
            0,
            0,
            ir/2,
            -i
            )
          verts2d.push([point.x,point.z])
          //verts2d.push(point.z)
          //console.log(point)
        }
      
      const delaunay = Delaunator.from(verts2d)
      
      const coordinates=[]
      for (let i = 0; i < delaunay.triangles.length; i += 3) {
    coordinates.push([
        verts2d[delaunay.triangles[i]],
        verts2d[delaunay.triangles[i + 1]],
        verts2d[delaunay.triangles[i + 2]]
    ]);
}
    //console.log(coordinates.length)
    const avoid=[0,1,2,3,4,5]
      let verts=[]
      
      coordinates.forEach((tri,i)=>{
        if (avoid.includes(i))
          return false
        tri.forEach(point=>{
          //console.log(point)
          verts=[
            ...verts,
            point[0],
            pos.y,
            point[1]
          ]
        })
      })
      
        
        
        
      this.navVertCollections.push({
        vertY:pos.y+2,
        itemPos:pos,
        vertices:[...verts]
      })
      
      
    }
    
  update(delta) {
    this.graphics.update(delta)
  }
  
}