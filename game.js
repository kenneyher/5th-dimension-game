// debug.inspect = true;

/*
|-------------------------------------------------------------------------------------|
|                                                                                     |
|                                     CONSTANTS                                       |
|                                                                                     |
|-------------------------------------------------------------------------------------|
*/

const LAYERS = ["bg", "game", "fx", "ui"];
const LEVELS_MUSIC = ["theme1", "theme2", "theme3", 'theme4', 'boss-theme'];

/*
|-------------------------------------------------------------------------------------|
|                                                                                     |
|                             COMPONENTS AND FUNCTIONS                                ||                                                                                     |
|-------------------------------------------------------------------------------------|
*/

function floating(){
  let limit = {max: 0, min: 0};
  let dir = 1;
  const SPEED = 10;
  return {
    id: "floating",
    require: ["pos"],
    add(){
      limit.max = this.pos.y + 8;
      limit.min = this.pos.y;
    },
    update(){
      if(this.pos.y > limit.max){
        dir = -1;
      }
      if(this.pos.y < limit.min){
        dir = 1;
      }
      this.move(0, SPEED*dir);
    }
  }
}

function spawner(type, p){
  p = p ?? {x: width(), y: height()/2}
  if(type == "hand"){
    add([sprite("hand", {anim: 'idle'}), layer("game"), scale(2), area({scale: 0.6}), origin("center"), pos(width(), randi(40, height() - 40)), "hand", "enemy", {health: 2,speedX: -180, speedY: 0,}]);
  }else if(type == "eye"){
    add([sprite("eye", {anim: 'idle'}), layer("game"), scale(2), area({scale: 0.6}), origin("center"), pos(randi(width()/2, width()), 0), "eye", "enemy", {health: 4, speedX: -150, speedY: 80,}]);
  }else if(type == "ghost"){
    add([sprite("ghost", {anim: 'idle'}), floating(), layer("game"), scale(2), area({scale: 0.8}), origin("center"), pos(width(), randi(140, height()  - 140)), "ghost", "enemy", {health: 8,speedX: -150, speedY: wave(-50, 50, time() * 2), t: 0}]);
  }else if(type == "virus"){
    add([sprite("virus", {anim: 'idle'}), layer("game"), rotate(270), scale(2), area({scale: 0.8}), origin("center"), pos(width(), randi(100, height()) - 100), "virus", "enemy", {health: 6,speedX: -150, speedY: Math.ceil(wave(-50, 50, time() * 2)), t: 0}]);
  }else if(type == "wendigo"){
    add([sprite("wendigo", {anim: 'idle'}), layer("game"), scale(2), area({scale: 0.8}), origin("center"), pos(width() - 50, randi(100, height() - 100)), "wendigo", "enemy", {health: 4, speedX: 0, speedY: 90, t: 0}]);
  }else if(type == 'spider'){
    add([sprite("skull"), layer("game"), scale(2), area({scale: 0.8}), origin("center"), pos(p), "spider", "enemy", {health: 4, speedX: -650 , speedY: 0}]);
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
        layer("bg"),
        z(1),
      ])
    })
  }else if(type == "hole"){
    add([
      sprite("hole", {anim: "idle"}),
      pos(width()/2, height()/2),
      scale(8),
      origin("center"),
      opacity(0.4),
      layer("bg"),
    ])
  }else if(type == 'green particles'){
    loop(0.2, () => {
      add([
        rect(5, 5),
        pos(randi(10, width() - 10), randi(10, height() - 10)),
        scale(randi(1, 5)),
        opacity(rand(0.1, 1)),
        color(226, 255, 147),
        lifespan(randi(0, 3), {fade: rand(1, 2)}),
        layer("bg"),
        z(1),
      ])
    })
  }else if(type == 'asteroids'){
    loop(2.5, () => {
      if(chance(0.5)){
        add([
          sprite(choose(['rock1', 'rock2'])),
          pos(width() - 10, randi(150, height() - 150)),
          scale(randi(5, 10)),
          opacity(rand(0.1, 0.6)),
          cleanup(),
          area(),
          origin('center'),
          move(LEFT, randi(50, 300)),
          layer("bg"),
          z(1),
        ])
      }
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

const spawnBullet = (type, p, vel) => {
  if(type == "g"){
    add([
      sprite('g-bullet'),
      scale(3),
      area({width: 10, height: 8, }),
      origin('center'),
      cleanup(),
      pos(p),
      move(vel, 260),
      "e-bullet",
      layer("fx"),
    ])
  }else if(type == "v"){
    add([
      sprite('v-bullet'),
      scale(3),
      area({width: 10, height: 8, }),
      origin('center'),
      cleanup(),
      pos(p),
      move(vel, 260),
      "e-bullet",
      layer("fx"),
    ])
  }else if(type == 'w'){
    add([
      sprite('w-bullet'),
      scale(3),
      area({width: 10, height: 8, }),
      origin('center'),
      cleanup(),
      pos(p),
      move(vel, 600),
      "e-bullet",
      layer("fx"),
    ])
  }else if(type == 'b'){
    add([
      sprite('b-bullet'),
      scale(3),
      area({width: 10, height: 8, }),
      origin('center'),
      cleanup(),
      pos(p),
      move(vel, 600),
      "e-bullet",
      layer("fx"),
    ])
  }
}

function kaboom(p, s){
  play("explo", {volume: 0.7});
  const ex = add([
    sprite("explosion", {anim: "explode"}),
    pos(p),
    scale(s),
    z(50),
    layer("fx"),
    origin("center"),
  ])
  ex.onAnimEnd("explode", () => {
    destroy(ex);
  })
}
const m = play("main-theme", {volume: 0.7, loop: true});
m.pause();
scene("home", () => {
  m.play();
  const logo = add([
    sprite("logo"),
    pos(width()/2, height()/3.8),
    scale(8),
    origin("center"),
  ])
  const STORY_MODE = add([
    text("STORY MODE", {size: 20}),
    pos(width()/2, height()/1.4),
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
    m.pause();
  })
})

scene("intro", (s) => {
  m.play()
  const intro = "SUDDENLY, YOU OPEN YOUR EYES. YOU ARE IN A CAPSULE. ALL YOU SEE IS BLACK, YOU START TO REMEMBER HOW DID YOU GET HERE YOU WERE IN A WHITE ROOM WITH SCIENTISTS, THEY TOLD YOU THAT YOU WILL GO TO THE 5TH DIMENSION. YOU START TO HEAR ROARINGS AND SIGHS. YOU PREPARE YOUR GUNS AND YOU TURN ON THE CAPSULE TO GET INTO THIS NEW DIMENSION."
  addText(intro, 20);
  onKeyPress("enter", () => {
    go(s);
    m.pause();
  })
})

scene("levels", () => {
  m.play()
  let names = ["1. THE ARRIVAL", "2. THE VOID", "3. THE HOLE", '4. THE NEST', '5. THE LEADER']
  for(let i=1; i<=5; i++){
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
      m.stop();
      go("play", b.level)
    })
  })
  add([
    text('THIS IS THE DEMO VERSION. MORE LEVELS WILL BE ADDED IN THE FULL VERSION. IF YOU WANT TO FOLLOW THE STORY PLEASE PLAY THE LEVELS IN ORDER', {size: 10, width: width()}),
    pos(width()/2, height() - 40),
    origin("center"),
  ])
  // add([text("BEING CREATED, PLEASE STAND BY", {size: 30, width: width()}), pos(width()/2, height()/2), origin("center"),]);
})

scene("play", (l) => {
  add([
    rect(width(), 10),
    pos(width()/2, 0),
    origin('center'),
    area(),
    opacity(0),
    'barrier'
  ])
  add([
    rect(width(), 10),
    pos(width()/2, height()),
    origin('center'),
    area(),
    opacity(0),
    'barrier'
  ])
  const music = play(LEVELS_MUSIC[l - 1], {loop: true, volume: 0.6});
  layers(LAYERS);
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
  }else if(l == 3){
    ENEMY_TYPES.push("hand", "eye", "ghost", "virus");
    limit = 20;
    createEffects("hole");
    createEffects("lights");
  }else if(l == 4){
    ENEMY_TYPES.push('ghost', 'virus', 'wendigo');
    limit = 15;
    createEffects('green particles');
    createEffects('asteroids');
  }else if(l == 5){
    ENEMY_TYPES.push('spider');
    createEffects('green particles');
    createEffects('asteroids');
  }

  const boss = add([
    sprite("boss", {anim: 'idle'}),
    pos(width() - 100, height()/2),
    origin('center'),
    scale(5),
    layer('game'),
    health(80),
    floating(),
    area({scale: 0.6}),
    'boss',
    {
      t: 0,
    }
  ])

  const healthbar = add([
    rect(width(), 24),
    pos(0, 0),
    color(255, 50, 50),
    fixed(),
    layer("ui"),
    {
      max: get('boss')[0].hp(),
      set(hp) {
        this.width = width() * hp / this.max;
        this.flash = true;
      },
    },
  ])

  healthbar.onUpdate(() => {
    if (healthbar.flash) {
      healthbar.color = rgb(255, 255, 255);
      healthbar.flash = false;
    } else {
      healthbar.color = rgb(255, 50, 50);
    }
  })

  boss.onDeath(() => {
    kaboom(boss.pos, 10);
    destroy(boss);
    wait(01, () => go('ending', l));
    music.stop();
  })

  onCollide('boss', 'bullet', (boss, b) => {
    boss.hurt();
    healthbar.set(boss.hp())
    destroy(b);
  })

  const deathIcon = add([
    sprite("skull-icon"),
    scale(2),
    pos(width() - 160, 25),
    layer('ui'),
    origin("center")
  ])
  const deathLabel = add([
    text(`${deathCounter} OF ${limit}`, {size: 20}),
    pos({x: deathIcon.pos.x + 100, y: deathIcon.pos.y}),
    layer('ui'),
    origin("center"),
  ])
  deathLabel.onUpdate(() => {
    deathLabel.text = `${deathCounter} OF ${limit}`;
  })

  onCollide("enemy", "bullet", (e, b) => {
    play(choose(["e-hurt-1","e-hurt-2","e-hurt-3", "e-hurt-4"]), {volume: 0.4, speed: 1.5})
    e.health -= b.dmg;
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
    if(e.is("ghost")){
      e.speedY = wave(-80, 80, time() * 1.5);
      e.t += dt();
      if(e.t > 1.5){
        spawnBullet('g', e.pos, LEFT);
        e.t = 0;
      }
    }
    if(e.is("virus")){
      e.speedY = Math.ceil(wave(-50, 50, time() * 2))
      e.t += dt();
      if(e.t > 1.5){
        spawnBullet('v', e.pos, vec2(-100, 60));
        spawnBullet('v', e.pos, vec2(-100, -60));
        spawnBullet('v', e.pos, vec2(-100, 0));
        e.t = 0;
      }
    }
    if(e.is("wendigo")){
      if(e.pos.y < 50){
        e.speedY = 100;
      }else if(e.pos.y > height() - 50){
        e.speedY = -100;
      }
      e.t += dt();
      if(e.t > 3){
        spawnBullet('w', e.pos, vec2(-100, 30));
        spawnBullet('w', e.pos, vec2(-100, -30));
        spawnBullet('w', e.pos, vec2(-100, 0));
        wait(0.001, () => e.t = 0);
      }
    }
    e.move(e.speedX, e.speedY);
  })

  onUpdate('boss', (b) => {
    b.t += dt();
      if(b.t > 2.5){
        spawnBullet('b', b.pos, vec2(-100, 15));
        spawnBullet('b', b.pos, vec2(-100, -15));
        spawnBullet('b', b.pos, vec2(-100, 30));
        spawnBullet('b', b.pos, vec2(-100, 0));
        spawnBullet('b', b.pos, vec2(-100, -30));
        spawnBullet('b', b.pos, vec2(-100, 45));
        spawnBullet('b', b.pos, vec2(-100, -45));
        spawnBullet('b', b.pos, vec2(-100, -60));
        spawnBullet('b', b.pos, vec2(-100, 60));
        wait(0.001, () => b.t = 0);
      }
  })

  const ship = add([
    sprite("ship-d", {anim: 'idle'}),
    scale(2),
    area({scale: 0.6}),
    origin("center"),
    health(4),
    pos(40, height()/2),
    layer("game"),
    {
      bulletColor: rgb(255, 255, 255),
    }
  ])

  const healthLabel = add([
    sprite("heart", {frame: 0}),
    scale(3),
    pos(width() - 210, 30),
    origin("center"),
    layer('ui'),
  ])

  if(l == 5){
    deathLabel.destroy();
    deathIcon.destroy();
    healthLabel.pos = {x: width() - 50, y: 30}
  }

  onKeyPress("space", () => {
    add([ 
      sprite('bullet', {anim: 'idle'}),
      area(),
      scale(2),
      origin("center"),
      pos(ship.pos),
      "bullet",
      color(ship.bulletColor),
      cleanup(),
      layer("fx"),
      {
        dmg: 1,
      }
    ])
    play("laser", {volume: 0.1});
  })

  ship.onDeath(() => {
    music.stop();
    kaboom(ship.pos, 5);
    ship.destroy();
    healthLabel.frame = 4;
    wait(1, () => go("game over"));
  })

  ship.onCollide("enemy", (e) => {
    kaboom(ship.pos, 5);
    ship.destroy();
    healthLabel.frame = 4;
    wait(1, () => go("game over"))
    music.stop();
  })
  ship.onCollide("e-bullet", (b) => {
    healthLabel.frame += 1;
    destroy(b);
    ship.hurt();
    play("hurt", {volume: 0.7});
    shake(25);
  })

  onKeyDown('up', () => {
    ship.move(0, -160)
  })
  onKeyDown('down', () => {
    ship.move(0, 160)
  })

  onUpdate('bullet', (b) => {
    b.move(500, 0);
    if(b.pos.x > width()){
      destroy(b);
    }
  })

  onUpdate(() => {
    if(deathCounter >= limit){
      music.stop();
      go("ending", l);
    }
    ship.pushOut(get('barrier')[0]);
    ship.pushOut(get('barrier')[1]);
  })

  if(l < 5){
    loop(1, () => {
      spawner(choose(ENEMY_TYPES));
    })
    boss.destroy();
    healthbar.destroy();
  }else {
    loop(0.85, () => {
      spawner(choose(ENEMY_TYPES), {x: width() - 20, y: ship.pos.y});
    })
  }
})

scene("ending", (idx) => {
  const ENDINGS = ['THOSE THINGS WERE NOT NORMAL, THEY HAD STRANGE SHAPES AND SEEMED DANGEROUS. WHATEVER THEY WERE, YOU KNEW THEY WERE NOT FRIENDLY. AFTER A LITTLE FLOATING IN THE VAST BLACK SPACE, YOU BEGIN TO SEE LIGHTS. BEAUTIFUL LIGHTS WITH DIFFERENT COLORS. YOU ARE AMAZED BY THE BEAUTY OF THIS PLACE. BUT THEN MORE MONSTERS BEGAN TO APPEAR.', 'THE MONSTERS KEPT COMING, THERE WERE THOUSANDS OF THEM, AS IF THEY WERE PROTECTING SOMETHING. YOU START CLEARING YOUR PATH, BUT THEN YOU FIND OUT WHAT THEY ARE PROTECTING. THE HOLE.', 'YOU APPROACH THE HOLE AND YOU ARE DRAWN BY IT. YOU TRY TO GO BACK BUT THE HOLE KEEPS DRAWING. YOUR WORK WAS USELESS BECAUSE YOU END UP IN THE HOLE ANYWAY. INSIDE IT, THERE WAS SOMETHING LIKE A HIVE WHERE MONSTERS WERE BORN. AND AT THE END OF IT, THERE WERE THOUSANDS OF EGGS PROTECTED BY A GREAT MONSTER.', 'THOSE THINGS KEPT COMING BUT YOU WERE QUICK ENOUGH TO KILL THEM BEFORE THEY REACHED YOU. YOU WERE APPROACHING THE CENTER OF THE NEST. WHEN YOU GOT THERE, THE BIG MONSTER THAT LOOKED LIKE A SPIDER WITH A SKULL INSTEAD OF A HEAD WAS SCREAMING AT YOU, AND THE CLOSER YOU WERE, THE MORE ANGRY THE MONSTER GETTEN. ', 'BEFORE THE MONSTER DIE IT SCREAMED, AND THEN ALL THE LITTLE MONSTERS WERE GOING TO YOU. TO KILL YOU BECAUSE YOU KILLED THEIR KING. YOU WANTED TO TURN ON YOUR GUNS BUT YOU DISCOVERED THAT YOUR SHIP RAN OUT OF ENERGY. SO YOU WERE ALONE, WITH NO DEFENSES AND WITH THOUSAND OF ANGRY MONSTERS GOING TO KILL YOU. THAT WAS YOUR END... WHAT A PITY...'];
  addText(ENDINGS[idx - 1], 20);
  onKeyPress("enter", () => {
    go("home");
  })
})

scene("game over", () => {
  const GAME_OVER_TEXTS = ['THE MONSTERS TOOK ALL THAT WAS IN YOUR SHIP, EVEN DEATH YOUR BODY', 'THEY LEFT YOUR BODY IN THERE. ALONE. IN THE ENDLESS BLACK SPACE', 'THE MONSTERS ATE EVERYTHING IN YOUR CAPSULE. EVEN YOUR DEAD BODY', 'YOU SEE THOSE THINGS CLOSER, THEY KEPT COMING, ALL OF THEM. THEY CAME TO EAT A SNACK', 'YOU WILL NEVER SEE THE LIGHT AGAIN... NEVER'];
  addText(GAME_OVER_TEXTS[randi(0, GAME_OVER_TEXTS.length)], 20);
  add([
    text("GAME OVER", {size: 30}),
    pos(width()/2, height()/3),
    origin("center"),
    color(RED),
  ])
  onKeyPress("enter", () => {
    go("home");
  })
})

go("home");