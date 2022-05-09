import * as THREE from "three"

export default class WallGraphics {
  
  constructor(scene,size,position,rotation,color="gray") {
    
    const geo = new THREE.PlaneBufferGeometry(size.x,size.y,2,2)
    const material=new THREE.MeshLambertMaterial({color:color})
    
    this.mesh=new THREE.Mesh(geo,material);
    
    this.mesh.position.x=position.x
    this.mesh.position.y=position.y+size.y/2;
    this.mesh.position.z=position.z
    //this.mesh.rotation.x=Math.PI/2;
    this.mesh.rotation.y=rotation;
    this.mesh.receiveShadow=true;
    //this.mesh.position.set(position.x,position.y,position.z)
    scene.add(this.mesh)
  }
  
}