import {Pathfinding} from "three-pathfinding"

import * as THREE from "three" 

export default class Pathfinder {
  constructor (navMesh) {
    this.pathfinder = new Pathfinding();
    this.navMesh=navMesh;

    this.zoneId="level"
    const zone = Pathfinding.createZone(this.navMesh.geometry,1);
    this.pathfinder.setZoneData( this.zoneId, zone );

    this.groupID = this.pathfinder.getGroup( this.zoneId, new THREE.Vector3(0,0,0) );
    //console.log(zone.groups.length)
    
  }
  
  getNextTarget(from,to) {
    
    const fromVec=new THREE.Vector3(from.x,from.y,from.z)
    
    if (!this.pathfinder.getClosestNode(fromVec,this.zoneId,this.pathfinder.getGroup( this.zoneId, fromVec ))) {
      from.y+=0.5
        if (!this.pathfinder.getClosestNode(fromVec,this.zoneId,this.pathfinder.getGroup( this.zoneId, fromVec ))) {
        from.y-=1
      }
    }
    
    
    const group=this.pathfinder.getGroup( this.zoneId, new THREE.Vector3(from.x,from.y,from.z) );
    const path = this.pathfinder.findPath( new THREE.Vector3(from.x,from.y,from.z), new THREE.Vector3(to.x,to.y,to.z), this.zoneId, group );
    if (path)
      return path[0];
      
    //console.log(from,to)
    return null;
  }
  
}