import LevelObject from "./LevelObject"

import Platform1Graphics from "../../graphics/levelObjects/Platform1"
import Platform1Physics from "../../physics/objects/Platform1"

const getFlatRectVerts=(tl,tr,bl,br,y) =>{
  return [
      	 br.x, y,  br.z,
      	 bl.x, y,  bl.z,
      	 tr.x, y, tr.z,
      
      	 tl.x, y,  tl.z,
      	 tr.x, y,  tr.z,
      	 bl.x, y,  bl.z
        ]
}


export default class Platform1 extends LevelObject {
    constructor({
      graphicsScene, 
      physicsWorld, 
      position,
      rotation, 
      scale={xz:1, y:1},
      onLoad
    }) {
      super(position,rotation)
        this.graphics = new Platform1Graphics(graphicsScene, position, rotation, scale,onLoad);
        this.physics = new Platform1Physics(physicsWorld, position, rotation, scale);
      
      
      this.setNavVerts(position,scale)
      
    }
    
    setNavVerts(pos,scale) {
      const ow=8;
      const iw=6;
     
      
      let tempVerts=[
        ...getFlatRectVerts(
          {
            x:pos.x-ow/2,
            z:pos.z+iw/2
          },
          {
            x:pos.x+ow/2,
            z:pos.z+iw/2
          },
          {
            x:pos.x-ow/2,
            z:pos.z-iw/2
          },
          {
            x:pos.x+ow/2,
            z:pos.z-iw/2
          },
          pos.y
        ),
        ...getFlatRectVerts(
          {
            x:pos.x-iw/2,
            z:pos.z+ow/2
          },
          {
            x:pos.x+iw/2,
            z:pos.z+ow/2
          },
          {
            x:pos.x-iw/2,
            z:pos.z+iw/2
          },
          {
            x:pos.x+iw/2,
            z:pos.z+iw/2
          },
          pos.y
        ),
        ...getFlatRectVerts(
          {
            x:pos.x-iw/2,
            z:pos.z-iw/2
          },
          {
            x:pos.x+iw/2,
            z:pos.z-iw/2
          },
          {
            x:pos.x-iw/2,
            z:pos.z-ow/2
          },
          {
            x:pos.x+iw/2,
            z:pos.z-ow/2
          },
          pos.y
        )
      	 
      	 ]
      
        
      this.navVertCollections.push({
        vertY:pos.y,
        itemPos:pos,
        vertices:[...tempVerts]
      })
      
      const topVerts=[
        ...getFlatRectVerts(
          {
            x:pos.x-ow/2,
            z:pos.z+ow/2
          },
          {
            x:pos.x+ow/2,
            z:pos.z+ow/2
          },
          {
            x:pos.x-ow/2,
            z:pos.z-ow/2
          },
          {
            x:pos.x+ow/2,
            z:pos.z-ow/2
          },
          pos.y+8*scale.y
        )
        
      ]
      this.navVertCollections.push({
        vertY:pos.y+8*scale.y,
        itemPos:pos,
        vertices:[...topVerts]
      })
      
    }
  /*
  get position() {
    return this._position;
  }
  
  set position(a,b,c) {
    let x,y,z;
    if (typeof(a)=="Object") {
      {x,y,z} = a;
    } else {
      x=a;
      y=b;
      z=c;
    }
    this._position={x:x,y:y,z:z}
    this.graphics.position=this._position;
    this.physics.position=this._position;
  }
  
  get rotation() {
    return this._rotation;
  }
  
  set rotation(value) {
    this._rotation=value;
    this.graphics.rotation=value;
    this.physics.rotation=value;
  }
  */
}