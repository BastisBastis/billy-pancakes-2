import Light from "../graphics/Light"

import Wall from "./levelObjects/Wall"
import Floor from "./levelObjects/Floor"

//Level objects
import Platform1 from "./levelObjects/Platform1"
import Pallet1 from "./levelObjects/Pallet1"
import PalletStack from "./levelObjects/PalletStack"
import PalletWall from "./levelObjects/PalletWall"
import Ramp from "./levelObjects/Ramp"
import Trap1 from "./levelObjects/Trap1"
import CarrotBarrel from "./levelObjects/CarrotBarrel"

//Enemies
import Muncher1 from "./enemies/Muncher1"

import NavMeshManager from "../helpers/NavMeshManager"
import Pathfinder from "../helpers/Pathfinder"

import Levels from "../assets/data/Levels"

const objectTypes={
  platform:Platform1,
  pallet:Pallet1,
  palletStack:PalletStack,
  ramp:Ramp,
  trap1:Trap1,
  carrotBarrel:CarrotBarrel,
  palletWall:PalletWall
}



export default class Level {
  
  constructor({
    graphicsEngine,
    physicsEngine,
    size,
    objects,
    lighting,
    playerStartPosition,
    playerStartRotation,
    tileSize=8,
    tileHeight=8,
    enemies,
    labels
  }) {
    this.graphicsEngine=graphicsEngine;
    this.physicsEngine=physicsEngine;
    
    this.tileSize=tileSize
    this.tileHeight=tileHeight
    
    
    
    //Setup room
    this.setupFloor(size)
    this.setupWalls(size)
    
    this.occupiedFloorTiles=[]
    this.itemVertices=[]
    this.attractions=[]
    
    //objects
    
    this.setupObjects(objects)
    
    this.setupLighting(lighting)
    
    this.playerStartPosition={
      x:playerStartPosition.x*this.tileSize,
      y:playerStartPosition.y*this.tileHeight,
      z:playerStartPosition.z*this.tileSize
    };
    this.playerStartRotation=playerStartRotation;
    
    let navVerts=[]
    this.itemVertices.forEach(iv=>
    {
      navVerts=[
        ...navVerts,
        ...iv.vertices
      ]
    })
    
    this.navMesh=NavMeshManager.fromData({
    scene:graphicsEngine.scene,
    occupiedFloorTiles:this.occupiedFloorTiles,
    vertices:navVerts,
    tileSize:tileSize,
    levelSize:size
  })
  this.pathfinder= new Pathfinder(this.navMesh)
  
  
    
    this.enemies=[
    ]
    enemies.forEach(enemy=>{
      this.enemies.push(new Muncher1({
        graphicsEngine:graphicsEngine,
        physicsEngine:physicsEngine,
        position:{
          x:enemy.position.x*this.tileSize,
          y:enemy.position.y*this.tileHeight,
          z:enemy.position.z*this.tileSize
        },
        rotation:enemy.rotation,
        pathfinder:this.pathfinder,
        attractions:this.attractions
      }))
    })
    
    this.labels=JSON.parse(JSON.stringify(labels))
  }
  
  setupWalls(size) {
    const w=size.x*this.tileSize;
    const d=size.z*this.tileSize
    const northWall= new Wall({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{
        x:size.x*this.tileSize,
        y:size.y*this.tileHeight},
      position:{
        x:w/2,y:0,
        z:d
      },
      rotation:Math.PI
    })
    const southWall= new Wall({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{
        x:size.x*this.tileSize,
        y:size.y*this.tileHeight
      },
      position:{
        x:w/2,y:0,
        z:0
      },
      rotation:0
    })
    const westWall= new Wall({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{
        x:size.z*this.tileSize,
        y:size.y*this.tileHeight
      },
      position:{
        x:0
        ,y:0,z:d/2},
      rotation:Math.PI/2
    })
    const eastWall= new Wall({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{
        x:size.z*this.tileSize,
        y:size.y*this.tileHeight},
      position:{
        x:w,
        y:0,z:d/2},
      rotation:-Math.PI/2
    })
  }
  
  setupFloor(size) {
    const floor= new Floor({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{
        x:size.x*this.tileSize,
        z:size.z*this.tileSize
      },
      position:{
        x:this.tileSize*size.x/2,
        y:0,
        z:this.tileSize*size.z/2
      }
    })
  }
  
  setupObjects(objects) {
    objects.forEach(o=>{
      const object=JSON.parse(JSON.stringify(o))
      if (Object.keys(objectTypes).includes(object.type)) {
        
        console.log(object.type)
        if (object.position){
          object.position.x=(object.position.x+0.5)*this.tileSize
          object.position.y*=this.tileHeight
          object.position.z=(object.position.z+0.5)*this.tileSize
        }
        
       if (object.type=="carrotBarrel") {
         object.index=this.attractions.length
       }
        
        const item=new objectTypes[object.type]({
          graphicsScene:this.graphicsEngine,
          physicsWorld:this.physicsEngine.world,
          ...object
        })
        
        if (item.attraction) {
          this.attractions.push(item);
        }
        
        if (object.position.y===0 && object.type!=="trap1" && object.type!=="carrotBarrel") {
          this.occupiedFloorTiles.push(object.position)
        }
        
        const vertCollections=item.navVertCollections;
        vertCollections.forEach(vc=>{
          const competingVc=this.itemVertices.find(cvc=>{
            return (
              vc.itemPos.x==cvc.itemPos.x &&
              vc.itemPos.z==cvc.itemPos.z &&
              vc.vertY==cvc.vertY
              )
          })
          if (competingVc) {
            if (competingVc.itemPos.y<vc.itemPos.y) {
              
            
              this.itemVertices=[
                ...this.itemVertices.filter(vertc=>vertc!==competingVc),
                vc
              ]
            }
          } else {
            this.itemVertices.push(vc)
          }
          
        })
        
      } else {
        console.log("Object type "+object.type+" not found")
      }
    })
  }
  
  setupLighting(lights) {
    lights.forEach(light=>{
      
      Light.addLight({
        scene:this.graphicsEngine.scene,
        lightType:light.type,
        options:light.options
      })
    })
  }
  
  static fromIndex(graphicsEngine,physicsEngine,index) {
   
    return new Level({
      graphicsEngine:graphicsEngine,
      physicsEngine:physicsEngine,
      ...Levels[index]
    })
  }
  
  destroy() {
    this.graphicsEngine=null;
    this.physicsEngine=null;
    
    
    //Setup room
    
    this.occupiedFloorTiles=null
    this.itemVertices=null
    this.attractions=null
    
    //objects
    
    
    let navVerts=null
    this.itemVertices=null
    this.navMesh=null
  this.pathfinder= null
  
  
    
    this.enemies=null
  }
  
}
