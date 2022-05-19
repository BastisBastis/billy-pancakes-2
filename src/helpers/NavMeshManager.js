import * as THREE from "three"



export default class NavMeshManager {
  
  static fromData({
    scene,
    occupiedFloorTiles,
    vertices,
    tileSize,
    levelSize
  }) {
    
    for (let x=0;x<levelSize.x*tileSize;x+=tileSize) {
      for (let z=0;z<levelSize.z*tileSize;z+=tileSize) {
        if (!occupiedFloorTiles.find(tile=>(
          tile.x==x+tileSize/2 &&
          tile.z==z+tileSize/2))) {
          
        const tl={
          x: x,
          y:0,
          z: z+tileSize
        }
        const tr={
          x: x+tileSize,
          y:0,
          z: z+tileSize
        }
        const bl={
          x: x,
          y:0,
          z:z
        }
        const br={
          x: x+tileSize,
          y:0,
          z:z
        }
        
        let tempVerts=[
      	 br.x, br.y,  br.z,
      	 bl.x, bl.y,  bl.z,
      	 tr.x,  tr.y, tr.z,
      
      	 tl.x,  tl.y,  tl.z,
      	 tr.x,  tr.y,  tr.z,
      	 bl.x,  bl.y,  bl.z
        ]
        vertices=[
          ...vertices,
          ...tempVerts
        ]
        }
      }
    }
    
    return NavMeshManager.fromVertices(scene,vertices)
  }
  
  static fromVertices(scene,verts) {
    const vertices = new Float32Array( [...verts] );
    const geo = new THREE.BufferGeometry
    geo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
    
    
    const material=new THREE.MeshLambertMaterial({
      color:0x00ffaa,
      transparent:true,
      opacity:0.4
      })
    
    
    
    const navMesh=new THREE.Mesh(geo,material)
    //scene.add(navMesh)
    navMesh.position.y=0.2
    //console.log("hm")
    return navMesh;
    
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
    
    scene.add(this.navMesh)
  }
  
}