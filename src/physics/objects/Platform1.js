import * as CANNON from "cannon-es"

export default class Platform1Physics {
    constructor (world, position, rotation, scale={xz:1, y:1}) {
        
        const size = {width:6*scale.xz, height:6*scale.y, depth:6*scale.xz}
        const legRadius=0.25*scale.xz
        const roofHeight=0.5*scale.xz
        
        this.body = new CANNON.Body({
            mass:0,
            position:new CANNON.Vec3(position.x, position.y+size.height/2, position.z)
        });
        

        const roofShape = new CANNON.Box(new CANNON.Vec3(size.width * 0.5, roofHeight * 0.5, size.depth * 0.5))
        const legShape  = new CANNON.Cylinder(legRadius, legRadius, size.height, 8)

        this.body.addShape(roofShape, new CANNON.Vec3(0,size.height/2-roofHeight/2, 0))
        this.body.addShape(legShape, new CANNON.Vec3(-size.width/2+legRadius, 0, -size.depth/2+legRadius))
        this.body.addShape(legShape, new CANNON.Vec3( size.width/2-legRadius, 0, -size.depth/2+legRadius))
        this.body.addShape(legShape, new CANNON.Vec3(-size.width/2+legRadius, 0,  size.depth/2-legRadius))
        this.body.addShape(legShape, new CANNON.Vec3( size.width/2-legRadius, 0,  size.depth/2-legRadius))
        world.addBody(this.body);
    }
}