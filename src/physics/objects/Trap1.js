import * as CANNON from "cannon-es"

export default class Trap1Physics {
    constructor (world, position, rotation,size, vertices) {
        
        
        
        this.body = new CANNON.Body({
            mass:0,
            position:new CANNON.Vec3(position.x, position.y, position.z)
        });
        
        const indices=[]
        for (let i=0;i<vertices.length/3;i++) {
          indices.push(i)
        }
        
        const trapShape= new CANNON.Trimesh(vertices,indices)

        this.body.addShape(trapShape)
        
        world.addBody(this.body);
        
        this.floorBody=new CANNON.Body({
            mass:0,
            position:new CANNON.Vec3(position.x, position.y, position.z)
        });
        
        this.wallBody=new CANNON.Body({
            mass:0,
            position:new CANNON.Vec3(position.x, position.y, position.z)
        });
        
        const wd=size.y/10
        const floorShape=new CANNON.Box(new CANNON.Vec3(size.x/2, 0.2, size.z/2))
        this.floorBody.addShape(floorShape)
        const wallShape1=new CANNON.Box(new CANNON.Vec3(size.x/2, size.y/4, wd))
        const wallShape2=new CANNON.Box(new CANNON.Vec3(wd, size.y/4, size.z/2))
        
        this.wallBody.addShape(wallShape1,new CANNON.Vec3(0, size.y/4, size.z/2+wd))
        this.wallBody.addShape(wallShape1,new CANNON.Vec3(0, size.y/4, -size.z/2-wd))
        this.wallBody.addShape(wallShape2,new CANNON.Vec3(size.x/2+wd, size.y/4, 0))
        this.wallBody.addShape(wallShape2,new CANNON.Vec3(-size.x/2-wd, size.y/4, 0))
        
        world.addBody(this.floorBody)
        world.addBody(this.wallBody)
        
    this.floorBody.addEventListener( "collide", (e)=>{
    
    const contact = e.contact;

    // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
    // We do not yet know which one is which! Let's check.
    const targetBody=contact.bi.id == this.floorBody.id?
      contact.bj:
      contact.bi;
      
    //console.log(targetBody.parent)

    if (targetBody.parent&&targetBody.parent.setTrapped)
      targetBody.parent.setTrapped()
    
  });
        
  }
}