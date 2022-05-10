import * as CANNON from "cannon-es"

export default class RampPhysics {
    constructor (world, position, rotation, scale={xz:1, y:1}) {
        
        const size = {width:8*scale.xz, height:4*scale.y, depth:8*scale.xz}
        const legDepth=1*scale.xz;
        const legHeight=size.height*0.8
        const roofHeight=0.2*scale.y
        const roofLength=Math.sqrt(size.width*size.width+size.height*size.height)
        
        this.body = new CANNON.Body({
            mass:0,
            position:new CANNON.Vec3(position.x, position.y+size.height/2, position.z)
        });
        

        const roofShape = new CANNON.Box(new CANNON.Vec3(size.width * 0.5, roofHeight * 0.5, roofLength * 0.5))
        const legShape  = new CANNON.Box(new CANNON.Vec3(size.width/2,legHeight/2,legDepth/2))
        
        

        this.body.addShape(roofShape, new CANNON.Vec3(0,0, 0), new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(-1,0,0),26*Math.PI/180))
        
        this.body.addShape(legShape, new CANNON.Vec3(0,-size.height/2+legHeight/2,size.depth*0.4))
        /*
        this.body.addShape(legShape, new CANNON.Vec3(-size.width/2+legRadius, 0, -size.depth/2+legRadius))
        this.body.addShape(legShape, new CANNON.Vec3( size.width/2-legRadius, 0, -size.depth/2+legRadius))
        this.body.addShape(legShape, new CANNON.Vec3(-size.width/2+legRadius, 0,  size.depth/2-legRadius))
        this.body.addShape(legShape, new CANNON.Vec3( size.width/2-legRadius, 0,  size.depth/2-legRadius))
        */
        world.addBody(this.body);
    }
}