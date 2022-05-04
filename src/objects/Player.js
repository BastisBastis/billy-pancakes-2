import PlayerModel from "../graphics/PlayerModel"

export default class Player {
  
  constructor ({
    graphicsEngine,
    position={x:0,y:0,z:0},
    rotation=0,
    onLoad=()=>false
  }) {
    this.graphics= new PlayerModel(graphicsEngine,position,rotation);
    this.position=position;
    this.rotation=rotation;
  }
  
  update(delta) {
    this.playerModel.update(delta,{
      x:this.position.x,
      y:this.position.y,
      z:this.position.z
    })
  }
  
}