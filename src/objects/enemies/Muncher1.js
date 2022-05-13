import Muncher1Graphics from '../../graphics/enemies/Muncher1'
import PhysicsBody from "../../physics/PhysicsBody"
import Muncher1Physics from "../../physics/enemies/Muncher1"

export default class Muncher1 {
  constructor({
    graphicsEngine,
    physicsEngine,
    position,
    rotation=0,
  }) {
    this.graphics=new Muncher1Graphics(graphicsEngine,position,rotation)
    this.physicsBody=PhysicsBody.getBody(
      physicsEngine.world,
      position,
      {
        width:3,
        height:1.5,
        depth:1
      },
      rotation,
      false
    );
    
    this.navMeshManager=graphicsEngine.navMeshManager;
    this.finalTarget={x:0,y:12,z:28}
    this.position=position;
    this.rotation=rotation;
    
    this.moveSpeed=3;
    
    this.setCurrentTarget();
  }
  
  setCurrentTarget() {
    this.currentTarget=this.navMeshManager.getNextTarget(this.position,this.finalTarget)
    console.log(this.currentTarget)
  }
  
  get distToTarget() {
    const dx=this.currentTarget.x-this.position.x;
    const dy=this.currentTarget.y-this.position.y;
    const dz=this.currentTarget.z-this.position.z;
    return Math.sqrt(
      dx*dx+
      dy*dy+
      dz*dz
    )
  }
  
  updateRotation(){
    const rot = Math.atan2(this.currentTarget.z-this.position.z,this.currentTarget.x-this.position.x)
    this.rotation=rot;
    this.physicsBody.rotation=rot;
    this.graphics.rotation=rot;
  }
  
  update(delta) {
    if (this.distToTarget<1) {
      this.setCurrentTarget()
    }
    this.updateRotation()
    
    this.physicsBody.velocity=this.moveSpeed;
    this.position=this.physicsBody.position;
    this.graphics.position=this.physicsBody.position
  }
}