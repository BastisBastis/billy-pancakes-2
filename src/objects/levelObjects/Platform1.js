import Platform1Graphics from "../../graphics/levelObjects/Platform1"
import Platform1Physics from "../../physics/objects/Platform1"

export default class Platform1 {
    constructor({graphicsScene, physicsWorld, position, rotation, scale={xz:1, y:1}}) {
        this.graphics = new Platform1Graphics(graphicsScene, position, rotation, scale);
        this.physics = new Platform1Physics(physicsWorld, position, rotation, scale);
    }
}