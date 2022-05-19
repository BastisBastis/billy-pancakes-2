import * as THREE from "three"

const getFace=(tl,tr,bl,br)=>{
  
  console.log([
  	 br.x, br.y,  br.z,
  	 bl.x, bl.y,  bl.z,
  	 tr.x, tr.y, tr.z,
  
  	 tl.x, tl.y,  tl.z,
  	 tr.x, tr.y,  tr.z,
  	 bl.x, bl.y,  bl.z
    ])
  
  return [
  	 br.x, br.y,  br.z,
  	 bl.x, bl.y,  bl.z,
  	 tr.x, tr.y, tr.z,
  
  	 tl.x, tl.y,  tl.z,
  	 tr.x, tr.y,  tr.z,
  	 bl.x, bl.y,  bl.z
    ]
}


export default class Trap1Graphics {
  
  constructor(scene,position, rotation, scale,color="green") {
    const size={
      x:8*scale.xz,
      y:1.5*scale.y,
      z:8*scale.xz
      }
      
    const ow=8*scale.xz/2
    const iw=4*scale.xz/2
    const h=size.y*scale.y
    
    const tempVerts=[
      ...getFace(
        {
          x:-ow,
          y:0,
          z:iw
        },
        {
          x:-iw,
          y:h,
          z:iw
        },
        {
          x:-ow,
          y:0,
          z:-iw
        },
        {
          x:-iw,
          y:h,
          z:-iw
        },
      ),
      ...getFace(
        {
          x:iw,
          y:h,
          z:iw
        },
        {
          x:ow,
          y:0,
          z:iw
        },
        {
          x:iw,
          y:h,
          z:-iw
        },
        {
          x:ow,
          y:0,
          z:-iw
        },
      ),
      ...getFace(
        {
          x:-iw,
          y:0,
          z:ow
        },
        {
          x:iw,
          y:0,
          z:ow
        },
        {
          x:-iw,
          y:h,
          z:iw
        },
        {
          x:iw,
          y:h,
          z:iw
        },
      ),
      ...getFace(
        {
          x:-iw,
          y:h,
          z:-iw
        },
        {
          x:iw,
          y:h,
          z:-iw
        },
        {
          x:-iw,
          y:0,
          z:-ow
        },
        {
          x:iw,
          y:0,
          z:-ow
        },
      ),
      ...getFace(
        {
          x:iw,
          y:h,
          z:iw
        },
        {
          x:iw,
          y:h,
          z:-iw
        },
        {
          x:iw,
          y:0,
          z:iw
        },
        {
          x:iw,
          y:0,
          z:-iw
        },
      ),
      ...getFace(
        {
          x:-iw,
          y:h,
          z:-iw
        },
        {
          x:-iw,
          y:h,
          z:iw
        },
        {
          x:-iw,
          y:0,
          z:-iw
        },
        {
          x:-iw,
          y:0,
          z:iw
        },
      ),
      ...getFace(
        {
          x:iw,
          y:h,
          z:-iw
        },
        {
          x:-iw,
          y:h,
          z:-iw
        },
        {
          x:iw,
          y:0,
          z:-iw
        },
        {
          x:-iw,
          y:0,
          z:-iw
        },
      ),
      ...getFace(
        {
          x:-iw,
          y:h,
          z:iw
        },
        {
          x:iw,
          y:h,
          z:iw
        },
        {
          x:-iw,
          y:0,
          z:iw
        },
        {
          x:iw,
          y:0,
          z:iw
        },
      ),
      //corners
      ow, 0, iw,
      iw, h, iw,
      iw, 0, ow,
      
      iw, 0, -ow,
      iw, h, -iw,
      ow, 0, -iw,
      
      -ow, 0, -iw,
      -iw, h, -iw,
      -iw, 0, -ow,
      
      -iw, 0, ow,
      -iw, h, iw,
      -ow, 0, iw
    ]
      
      
    const vertices = new Float32Array( [...tempVerts] );
    
    const geo = new THREE.BufferGeometry
    geo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
    
    
    const material=new THREE.MeshLambertMaterial(
      {
        color:color,
        castShadow:true,
        recieveShadow:true
        
      })
    geo.computeVertexNormals()
    this.mesh=new THREE.Mesh(geo,material);
    
    this.mesh.position.x=position.x
    this.mesh.position.y=position.y;
    this.mesh.position.z=position.z
    this.mesh.receiveShadow=true;
    
    //this.mesh.position.set(position.x,position.y,position.z)
    scene.add(this.mesh)
    
    this.vertices=tempVerts
  }
  
  
}