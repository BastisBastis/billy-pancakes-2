import Muncher1Graphics from '../../graphics/enemies/Muncher1'
import PhysicsBody from "../../physics/PhysicsBody"
import Muncher1Physics from "../../physics/enemies/Muncher1"

import EventCenter from "../../helpers/EventCenter"

import {PathfindingHelper} from "three-pathfinding"

import * as THREE from "three"


const mod = (a, n) => (a % n + n) % n

export default class Muncher1 {
  constructor({
    graphicsEngine,
    physicsEngine,
    position,
    rotation=0,
    pathfinder,
    attractions,
    demo=false,
    onLoad=()=>false
  }) {
    this.demo=demo
    this.graphics=new Muncher1Graphics(graphicsEngine,position,rotation,onLoad)
    this.physicsBody=new Muncher1Physics(
      physicsEngine.world,
      position,
      {
        width:0.5,
        height:4,
        depth:0.5
      },
      rotation,
      this
    );
    this.pathfinder=pathfinder;
    this.attractions=attractions
    //this.navMeshManager=graphicsEngine.navMeshManager;
    this.finalTarget={x:3,y:0,z:28}
    this.position=position;
    this.rotation={x:0,y:rotation,z:0};
    this.dir={x:0,y:rotation,z:0};
    
    //this.pathHelper = new PathfindingHelper();
    //graphicsEngine.scene.add(this.pathHelper)
    
    this.dummyPos=this.position;
    
    this.moveSpeed=0.1;
    this.trapped=false;
    this.kickRangeTimer=0;
    this.flying=false;
    
    EventCenter.on("updatePlayerPosition",data=>{
      //this.setFinalTarget(data.position)
      })
    EventCenter.on("kick",data=>{
      if (data.checkKickRange(this.physicsBody.position)) {
        
        EventCenter.emit("playSound",{sound:"kickHit"})
        
        //EventCenter.emit("playSound",{sound:"fly"})
        //this.graphics.sounds.fly.play()
        console.log(this.graphics.sounds.fly.play())
        
        this.physicsBody.setVelocity(data.dir)
        this.physicsBody.canJump=false;
        this.flying=true;
      }
      /*
      if (this.kickRangeTimer>-10){
        try { 
        this.physicsBody.setVelocity(data.dir)
        this.physicsBody.canJump=false;
        } catch (er) {console.log(er.message)} 
      }
      */
    })
      /*
      this.pathHelper
				.setPlayerPosition( new THREE.Vector3(this.position.x,this.position.y,this.position.z ) )
				.setTargetPosition( new THREE.Vector3(this.finalTarget.x,this.finalTarget.y,this.finalTarget.z) );
    })
    */
    if (!demo)
      this.setCurrentTarget();
 }
 
  setFinalTarget(pos) {
    this.finalTarget=new THREE.Vector3(pos.x,pos.y,pos.z)
    this.setCurrentTarget()
    /*
    this.pathHelper.setTargetPosition( this.finalTarget );
				
				
    const targetGroupID = this.pathfinder.pathfinder.getGroup( "level", this.finalTarget, true );
			const closestTargetNode = this.pathfinder.pathfinder.getClosestNode( this.finalTarget, "level", targetGroupID, true );
    if (closestTargetNode) 
      this.pathHelper.setNodePosition( closestTargetNode.centroid );
      */
  }
  
  
  
  setCurrentTarget() {
    if (!this.finalTarget) {
      
      return false
    }
      
    let path=this.pathfinder.getNextTarget(this.dummyPos,this.finalTarget)
    
    if (path) {
      this.currentTarget=path
      //console.log(path)
      // this.pathHelper.setPath( path );
    } else {
      
      //const closestPlayerNode = this.pathfinder.pathfinder.getClosestNode( this.finalTarget, "level", groupID );
      //console.log(closestPlayerNode)
      this.currentTarget=this.finalTarget
      
				//const clamped = new THREE.Vector3();
				


    }
    
    
    //console.log(this.currentTarget)
  }
  
  get distToTarget() {
    const dx=this.finalTarget.x-this.position.x;
    const dy=this.finalTarget.y-this.position.y;
    const dz=this.finalTarget.z-this.position.z;
    return Math.sqrt(
      dx*dx+
      dy*dy+
      dz*dz
    )
  }
  
  updateRotation(){
    const targetRotY=Math.atan2(this.dir.z,this.dir.x)
    
    let dy=(targetRotY-this.rotation.y)/(Math.PI/180)
    
    //let dy2=(this.rotation.y-targetRotY)/Math.PI/180
    
    //console.log(dy)
    
    dy=mod((dy + 180) , 360) - 180
    dy*=(Math.PI/180)
    
    this.rotation.y+=dy*0.05
    this.graphics.rotation=this.rotation
    /*
    //const dy=targetRotY-this.rotation.y
    //this.rotation.y+=dy*0.05
    const targetRotation={
      x:this.rotation.x,
      y:targetRotY,
      z:this.rotation.z
    }
    
    //this.graphics.rotation=targetRotation;
    //return false
    this.graphics.lerpRotation(targetRotation,0.8)
    this.rotation=this.graphics.rotation;
    //console.log(this.rotation)
    
    /*
    /*
    const rot = Math.atan2(this.currentTarget.z-this.position.z,this.currentTarget.x-this.position.x)
    this.rotation=rot;
    this.physicsBody.rotation=rot;
    this.graphics.rotation=rot;
    */
    
    
  }
  
  setTrapped() {
    if (!this.trapped)
      EventCenter.emit("enemyTrapped")
    this.trapped=true;
  }
  
  setInKickRange() {
    this.kickRangeTimer=5;
  }
  
  setDummyPosition() {
    this.dummyPos=this.physicsBody.position;
  }
  
  updateDummyPosition() {
    if (!this.currentTarget) {
        
      return false
    }
      
    const moveSpeed=this.moveSpeed
    this.dir=new THREE.Vector3(
      this.currentTarget.x-this.dummyPos.x,
      this.currentTarget.y-this.dummyPos.y,
      this.currentTarget.z-this.dummyPos.z
    ).normalize()
    this.dummyPos.x+=this.dir.x*moveSpeed;
    this.dummyPos.y+=this.dir.y*moveSpeed;
    this.dummyPos.z+=this.dir.z*moveSpeed;
    //console.log(this.currentTarget,this.dummyPos,this.finalTarget)
    
    //console.log(this.dummyPos)
  }
  
  pickTarget() {
    let bestTarget;
    let bestPoints;
    
    this.attractions.forEach(attraction=>{
      const dx=this.position.x-attraction.position.x;
      const dy=this.position.y-attraction.position.y;
      const dz=this.position.z-attraction.position.z;
      
      const dist = Math.sqrt(dx*dx+dy*dy+dz*dz)
      
      const points=attraction.attraction-dist;
      
      if (!bestPoints ||bestPoints<points) {
        bestPoints=points;
        bestTarget=attraction;
      }
      })
      
    if (bestPoints<0) {
      this.finalTarget=false;
    } else {
      this.setFinalTarget(bestTarget.position);
      this.targetObject=bestTarget
    }
  }
  
  update(delta) {
    this.graphics.update(delta)
    
    if (this.demo) {
      if (this.physicsBody.canJump) {
        this.physicsBody.setVelocity({x:-4,y:0,z:0})
      }
      this.position=this.physicsBody.position;
      this.graphics.position=this.physicsBody.position
      return false
    }
    
    if (this.trapped) {
      
      this.physicsBody.stop()
      this.rotation.y+=0.04
      this.graphics.rotation=this.rotation
    } else {
      
      
      
      this.graphics.position=this.physicsBody.position
      //this.graphics.position=this.dummyPos
      
      if (!this.physicsBody.canJump)
      
        return false;
        
      if (this.flying) {
        //just landed
        this.flying=false;
        this.setDummyPosition()
      }
      
      this.pickTarget()
      this.position=this.physicsBody.position;
      this.physicsBody.moveTo(this.dummyPos)
      
      if (!this.finalTarget) {
        this.physicsBody.stop()
        //console.log(Math.random())
        return false
      }
      
      if (this.distToTarget<3) {
        //Nibble at target
        //console.log(1)
        this.targetObject.getAttacked(delta)
        this.physicsBody.stop()
        return false
      }
        
      
     
      this.updateRotation()
      
      
      this.updateDummyPosition()
      
      
      
      
      
      //this.physicsBody.velocity=this.moveSpeed;
      //this.position=this.physicsBody.position;
      
      
      //this.physicsBody.position=this.position
      
      
      //this.physicsBody.update(delta)
    
    }
  }
}