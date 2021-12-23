// debug.inspect = true;

/*
|-------------------------------------------------------------------------------------|
|                                                                                     |
|                             COMPONENTS AND FUNCTIONS                                ||                                                                                     |
|-------------------------------------------------------------------------------------|
*/

function spawner(type){
  if(type == "hand"){
    add([sprite("hand"), scale(3), area({scale: 0.6}), origin("center"), pos(width(), randi(0, height())), "hand", "enemy", {health: 2, speedX: -180, speedY: 0,}]);
  }else if(type == "eye"){
    add([sprite("eye"), scale(3), area({scale: 0.6}), origin("center"), pos(randi(width()/2, width()), 0), "eye", "enemy", {health: 4, speedX: -150, speedY: 80,}]);
  }else if(type == "ghost"){
    add([sprite("eye"), scale(3), area({scale: 0.6}), origin("center"), pos(width(), randi(0, height())), "ghost", "enemy", {health: 8, speedX: -150, speedY: 0,}]);
  }
}

function createEffects(type){
  if(type == "lights"){
    loop(0.2, () => {
      add([
        rect(5, 5),
        pos(randi(0, width()), randi(0, height())),
        scale(randi(1, 4)),
        opacity(rand(0.1, 1)),
        color(randi(0, 255), randi(0, 255), randi(0, 255)),
        lifespan(randi(0, 3), {fade: rand(1, 2)}),
        z(1),
        "star",
      ])
    })
  }
}

function addText(t, s){
  add([
    text(t, {
      size: s, 
      width: width(),
      transform: (idx, ch) => ({
        pos: vec2(0, wave(-2, 2, time() * 1.5 + idx * 0.5)),
        scale: wave(1, 1.2, time() * 2 + idx),
        // angle: wave(-9, 9, time() * 3 + idx),
      }),
    }),
    origin("center"),
    pos(width()/2, height()/2),
    z(100)
  ])
}

function kaboom(p, s){
  play("explo", {volume: 0.7});
  const ex = add([
    sprite("explosion", {anim: "explode"}),
    pos(p),
    scale(s),
    z(50),
    origin("center"),
  ])
  ex.onAnimEnd("explode", () => {
    destroy(ex);
  })
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
    go("intro", "levels");
  })
})

scene("intro", (s) => {
  const intro = "SUDDENLY, YOU OPEN YOUR EYES. YOU ARE IN A CAPSULE. ALL YOU SEE IS BLACK, YOU START TO REMEMBER HOW DID YOU GET HERE YOU WERE IN A WHITE ROOM WITH SCIENTISTS, THEY TOLD YOU THAT YOU WILL GO TO THE 5TH DIMENSION. YOU START TO HEAR ROARINGS AND SIGHS. YOU PREPARE YOUR GUNS AND YOU TURN ON THE CAPSULE TO GET INTO THIS NEW DIMENSION."
  addText(intro, 20);
  onKeyPress("enter", () => {
    go(s);
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
      // debug.log(b.level)
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
  // debug.log(l);
  const ENEMY_TYPES = [];
  let limit;
  let deathCounter = 0;
  if(l == 1){
    ENEMY_TYPES.push("hand", "eye");
    limit = 20;
  }else if(l == 2){
    ENEMY_TYPES.push("hand", "eye", "ghost");
    limit = 25;
    createEffects("lights");
  }
  loop(2, () => {
    spawner(choose(ENEMY_TYPES));
  })
  onCollide("enemy", "bullet", (e, b) => {
    play(choose(["e-hurt-1","e-hurt-2","e-hurt-3", "e-hurt-4"]), {volume: 0.4, speed: 1.5})
    e.health -= 1;
    destroy(b);
  })
  onUpdate("enemy", (e) => {
    if(e.health < 1){
      kaboom(e.pos, 5);
      destroy(e);
      deathCounter++;
    }
    if(e.pos.x < 0 || e.pos.y > height() + 20){
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
      color(ship.bulletColor),
      cleanup(),
    ])
    play("laser", {volume: 0.05});
  })

  ship.onCollide("enemy", (e) => {
    kaboom(ship.pos, 5);
    ship.destroy();
    wait(1, () => go("game over"))
  })

  onKeyDown('up', () => {
    ship.move(0, -160)
  })
  onKeyDown('down', () => {
    ship.move(0, 160)
  })

  onUpdate('bullet', (b) => {
    b.move(350, 0);
    if(b.pos.x > width()){
      destroy(b);
    }
  })

  onUpdate(() => {
    if(deathCounter > limit){
      go("ending", l);
    }
  })
})

scene("ending", (idx) => {
  const ENDINGS = ['THOSE THINGS WERE NOT NORMAL, THEY HAD STRANGE SHAPES AND THEY SEEMED DANGEROUS. WHATEVER THOSE THINGS WERE YOU KNEW THEY ERE NOT FRIENDLY. AFTER A BIT FLOATING IN THE IMMENSE BLACK SPACE, YOU START TO SEE LIGHTS. BEAUTIFUL LIGHTS WITH DIFERENT COLORS. YOU ARE STUNNED BY THE BEAUTY OF THIS PLACE. BUT THEN, MORE MONSTERS STARTTED TO APPEAR.'];
  addText(ENDINGS[idx - 1], 20);
  onKeyPress("enter", () => {
    go("levels");
  })
})

scene("game over", () => {
  const GAME_OVER_TEXTS = ['THE MONSTERS TOOK ALL THAT WAS IN YOUR SHIP, EVEN YOUR BODY', 'THEY LEFT YOUR BODY IN THERE. ALONE. IN THE ENDLESS BLACK SPACE', 'THE MONSTERS ATE EVERYTHING IN YOUR CAPSULE. EVEN YOUR DEAD BODY'];
  addText(GAME_OVER_TEXTS[randi(0, GAME_OVER_TEXTS.length)], 20);
  add([
    text("GAME OVER", {size: 30}),
    pos(width()/2, height()/3),
    origin("center"),
    color(RED),
  ])
  onKeyPress("enter", () => {
    go("levels");
  })
})

go("home");