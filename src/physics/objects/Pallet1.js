import * as CANNON from "cannon-es"

export default class Platform1Physics {
    constructor (world, position, rotation, scale={xz:1, y:1}) {
        
        const itemScale=3
        const size = {width:0.666*itemScale*scale.xz, height:0.2*itemScale*scale.y, depth:itemScale*scale.xz}
        
        
        this.body = new CANNON.Body({
            mass:0,
            position:new CANNON.Vec3(position.x, position.y+size.height/2, position.z)
        });
        

        const shape = new CANNON.Box(new CANNON.Vec3(size.width * 0.5, size.height * 0.5, size.depth * 0.5))
        
        this.body.addShape(shape)
        
        world.addBody(this.body);
    }
}