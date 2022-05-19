import * as CANNON from "cannon-es"

export default class CarrotBarrelPhysics {
    constructor (world, position, rotation, scale={xz:1, y:1}) {
        
        const r=1.25*scale.xz;
        const h=4*scale.y;
        
        
        
        this.body = new CANNON.Body({
            mass:0,
            position:new CANNON.Vec3(position.x, position.y+h/2, position.z)
        });
        

        const shape = new CANNON.Cylinder(r, r, h,16)
        
        this.body.addShape(shape)
        
        world.addBody(this.body);
    }
}