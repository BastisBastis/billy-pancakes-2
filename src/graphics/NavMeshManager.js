import * as THREE from "three"

import {Pathfinding} from 'three-pathfinding';


export default class NavMeshManager {
  constructor (scene) {
    this.pathfinder = new Pathfinding();

    this.test1(scene)
    this.zoneId="level"
    const zone = Pathfinding.createZone(this.navMesh.geometry);
    this.pathfinder.setZoneData( this.zoneId, zone );

    this.groupID = this.pathfinder.getGroup( this.zoneId, new THREE.Vector3(0,0,0) );
    
    

  }
  
  getNextTarget(from,to) {
    const path = this.pathfinder.findPath( new THREE.Vector3(from.x,from.y,from.z), new THREE.Vector3(to.x,to.y,to.z), this.zoneId, this.groupID );
    if (path)
      return path[0];
    return null;
  }
  
  
  test1(scene) {
    let dx=0;
    let dy=0;
    let dz=0
    
    const tl={x: -4,y:0,z: 0}
    const tr={x: 4,y:0,z: 0}
    const bl={x: -4,y:0,z:-8}
    const br={x: 4,y:0,z:-8}
    
    let tempVerts=[
	 br.x, br.y,  br.z,
	 bl.x, bl.y,  bl.z,
	 tr.x,  tr.y, tr.z,

	 tl.x,  tl.y,  tl.z,
	 tr.x,  tr.y,  tr.z,
	 bl.x,  bl.y,  bl.z
]

    dz=-8;

    tempVerts= [
      ...tempVerts,
       dx+br.x, dy+br.y,dz+br.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    
    	 dx+tl.x, dy+tl.y,dz+tl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z
      
    ]
    
    dz=-8;
    dx=8

    tempVerts= [
      ...tempVerts,
       dx+br.x, dy+br.y,dz+br.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    
    	 dx+tl.x, dy+tl.y,dz+tl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z
      
    ]
    dz=-8;
    dx=16

    tempVerts= [
      ...tempVerts,
       dx+br.x, dy+br.y,dz+br.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    
    	 dx+tl.x, dy+tl.y,dz+tl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z
      
    ]
    dx=24

    tempVerts= [
      ...tempVerts,
       dx+br.x, dy+br.y,dz+br.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    
    	 dx+tl.x, dy+tl.y,dz+tl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z
      
    ]
    dx=32

    tempVerts= [
      ...tempVerts,
       dx+br.x, dy+br.y,dz+br.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    
    	 dx+tl.x, dy+tl.y,dz+tl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z
      
    ]
    
    dz=0

    tempVerts= [
      ...tempVerts,
       dx+br.x, dy+br.y,dz+br.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    
    	 dx+tl.x, dy+tl.y,dz+tl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z
      
    ]
    
    dz=8

    tempVerts= [
      ...tempVerts,
       dx+br.x, dy+br.y,dz+br.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    
    	 dx+tl.x, dy+tl.y,dz+tl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z
      
    ]
    
    dz=8
    dy=0
    dx=0

    tempVerts= [
      ...tempVerts,
       dx+br.x, dy+br.y,dz+br.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z,
    	 dx+tr.x, dy+tr.y+4,dz+tr.z,
    
    	 dx+tl.x, dy+tl.y+4,dz+tl.z,
    	 dx+tr.x, dy+tr.y+4,dz+tr.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z
      
    ]
    
    dz=16
    dy=4

    tempVerts= [
      ...tempVerts,
       dx+br.x, dy+br.y,dz+br.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z,
    	 dx+tr.x, dy+tr.y+4,dz+tr.z,
    
    	 dx+tl.x, dy+tl.y+4,dz+tl.z,
    	 dx+tr.x, dy+tr.y+4,dz+tr.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z
      
    ]
    dz=24
    dy=8

    tempVerts= [
      ...tempVerts,
       dx+br.x, dy+br.y,dz+br.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z,
    	 dx+tr.x, dy+tr.y+4,dz+tr.z,
    
    	 dx+tl.x, dy+tl.y+4,dz+tl.z,
    	 dx+tr.x, dy+tr.y+4,dz+tr.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z
      
    ]
    dz=32
    dy=12
    tempVerts= [
      ...tempVerts,
       dx+br.x, dy+br.y,dz+br.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    
    	 dx+tl.x, dy+tl.y,dz+tl.z,
    	 dx+tr.x, dy+tr.y,dz+tr.z,
    	 dx+bl.x, dy+bl.y,dz+bl.z
      
    ]
    
    const vertices = new Float32Array( [...tempVerts] );
    
    const geo = new THREE.BufferGeometry
    geo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
    
    
    const material=new THREE.MeshLambertMaterial({color:0x00ffaa})
    
    this.navMesh=new THREE.Mesh(geo,material)
    
    //scene.add(this.navMesh)
  }
  
}