// kaboom({
//   width: 840,
//   height: 450,
//   background: [0,0,0],
//   font: "monogram",
//   crisp: true,
// });

// debug.inspect = true;

/*
|-------------------------------------------------------------------------------------|
|                                                                                     |
|                                      COMPONENTS                                     ||                                                                                     |
|-------------------------------------------------------------------------------------|
*/
function addLevelButton(name, difficulty, p, w, h, t){
  add([
    text(name, {size: 20}),
    pos(p),
    origin("right"),
    area(),
    scale(1),
    z(10),
  ])
  add([
    text("DIFFICULTY " + difficulty, {size: 10, width: 100}),
    pos({x: p.x + 120, y: p.y}),
    origin("center"),
    area(),
    scale(0.8),
    z(10),
  ])
  add([rect(w, h), pos(p), origin("center"), scale(1), outline(3  , rgb (204, 0, 58 )), color(255, 32, 96), t]);
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
  add([text("BEING CREATED, PLEASE STAND BY", {size: 30, width: width()}), pos(width()/2, height()/2), origin("center"),])
})

go("home");