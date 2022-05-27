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
  
  
  
}