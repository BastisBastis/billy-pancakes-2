import * as THREE from "three"

export default class FloorGraphics {
  
  constructor(scene,size,position,color="gray") {
    
    const geo = new THREE.BoxBufferGeometry(size.x,size.y,size.z)
    const material=new THREE.MeshLambertMaterial({color:color})
    
    this.mesh=new THREE.Mesh(geo,material);
    
    this.mesh.position.x=position.x
    this.mesh.position.y=position.y-size.y/2;
    this.mesh.position.z=position.z
    this.mesh.receiveShadow=true;
    //this.mesh.position.set(position.x,position.y,position.z)
    scene.add(this.mesh)
  }
  
}