// debug.inspect = true;

/*
|-------------------------------------------------------------------------------------|
|                                                                                     |
|                                      COMPONENTS                                     ||                                                                                     |
|-------------------------------------------------------------------------------------|
*/
function spawner(type){
  if(type == "hand"){
    add([sprite("hand"), scale(2), area({scale: 0.6}), origin("center"), pos(width(), randi(0, height())), "hand", "enemy", {health: 5, speedX: -180, speedY: 0,}]);
  }else if(type == "eye"){
    add([sprite("eye"), scale(2), area({scale: 0.6}), origin("center"), pos(randi(width()/2, width()), 0), "eye", "enemy", {health: 8, speedX: -150, speedY: 80,}]);
  }
}

scene("home", () => {
  const STORY_MODE = add([
    text("STORY MODE", {size: 20}),
    pos(width()/2, height()/2),
    origin("center"),
    area(),
    scale(1),
    z(10),
  ])
  add([rect(200, 40), pos(STORY_MODE.pos), origin("center"), scale(1), outline(3  , rgb (204, 0, 58 )), color(255, 32, 96), "bar-s", area()]);

  get("bar-s")[0].onHover(() => {
    STORY_MODE.scale = 1.1;
    get("bar-s")[0].scale = 1.1;
  }, () => {
    STORY_MODE.scale = 1;
    get("bar-s")[0].scale = 1;
  })

  get("bar-s")[0].onClick(() => {
    go("levels");
  })
})

scene("levels", () => {
  let names = ["1. THE ARRIVAL", "2. THE VOID", "3 THE HOLE"]
  for(let i=1; i<=3; i++){
    add([text(names[i-1], {size: 20}),
      pos(width()/2, 40*i == 60 ? 40 : 40*i + 20*i),
      origin("center"),
      area(),
      scale(1),
      z(10),
      "level text"
    ]);
    add([
      rect(400, 40),
      pos(width()/2, 40*i == 40 ? 60 : 40*i + 20*i),
      origin("center"),
      scale(1), 
      outline(3, rgb (204, 0, 58 )), 
      color(255, 32, 96), 
      "bar", 
      area(),
      {
        level: i,
      }
    ])
  }
  every("bar", (b) => {
    b.onHover(() => {
      get("level text")[b.level  > 0 ? b.level - 1 : b.level].scale = 1.1;
      b.scale = 1.1
    }, () => {
      get("level text")[b.level  > 0 ? b.level - 1 : b.level].scale = 1;
      b.scale = 1;
    })
    b.onClick(() => {
      go("play", b.level)
    })
  })
  // add([text("BEING CREATED, PLEASE STAND BY", {size: 30, width: width()}), pos(width()/2, height()/2), origin("center"),]);
})

scene("play", (l) => {
  const ENEMY_TYPES = [];
  if(l == 1){
    ENEMY_TYPES.push("hand", "eye");
  }
  loop(2, () => {
    spawner(choose(ENEMY_TYPES))
  })
  onCollide("enemy", "bullet", (e, b) => {
    e.health -= 1;
    destroy(b);
  })
  onUpdate("enemy", (e) => {
    if(e.health < 1){
      destroy(e);
    }
    e.move(e.speedX, e.speedY);
  })

  const ship = add([
    sprite("ship-d"),
    scale(3),
    area({scale: 0.6}),
    origin("center"),
    pos(40, height()/2),
    rotate(0),
    {
      bulletColor: rgb(255, 255, 255),
    }
  ])

  onKeyPress("space", () => {
    add([
      rect(8, 8),
      area(),
      origin("center"),
      pos(ship.pos),
      "bullet",
      color(ship.bulletColor)
    ])
  })
  onKeyDown('up', () => {
    ship.move(0, -160)
  })
  onKeyDown('down', () => {
    ship.move(0, 160)
  })

  onUpdate('bullet', (b) => {
    b.move(350, 0)
  })
})

go("home");