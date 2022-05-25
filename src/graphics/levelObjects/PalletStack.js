import Pallet1 from "./Pallet1"

export default class PalletStackGraphics {
  constructor(graphicsEngine,pallets) {
    graphicsEngine.addObject(this);
    this.pallets=pallets
    this.hideCounter=0
  }
  
  get meshes() {
    let meshes=[]
    
    this.pallets.forEach(p=>{
      meshes=[
        ...meshes,
        ...p.meshes
      ]
    })
    return meshes
  }
  
  
  
  testObstruction(raycasters,maxDistance) {
    
      try { 
      //console.log(this.meshes)
      
      if (true) {
        
        let obstructionCount=0;
        raycasters.forEach((ray,i)=>{
          const rayHits=ray.intersectObjects(this.meshes)
          
          
          
          rayHits.forEach(rayHit=>{
            
            obstructionCount+=rayHit.distance<maxDistance?1:0;
          })
        })
        
      if (obstructionCount>0) {
        this.hideCounter=2;
        
        
        
        this.meshes.forEach(mesh=>{
          //console.log("hufe")
          mesh.material.transparent=true
          mesh.material.opacity=0.2;
          //mesh.material.color=0x00ffff
          mesh.material.needsUpdate=true
          //console.log(mesh.material.color)
          
        })
      } else {
        
        if (this.hideCounter>0) {
          this.hideCounter--;
          if (this.hideCounter==0) {
            this.meshes.forEach(mesh=>{
          mesh.material.opacity=1;
          mesh.material.transparent=false
          mesh.material.needsUpdate=true
          
        })
          }
        }
      }
        
      }
      
      } catch (er) {console.log(er.message);console.log(er.message)} 
    }
}