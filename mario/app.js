kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

loadRoot("https://i.imgur.com/");
loadSprite("regBrick", "pogC9x5.png");
loadSprite("redBrick", "M6rwarW.png");
loadSprite("blueBrick", "fVscIbn.png");
loadSprite("blueBrick2", "3e5YRQd.png");
loadSprite("steelBrick", "gqVoI2b.png");
loadSprite("itemBrickActive", "gesQ1KP.png");
loadSprite("itemBrickNotActive", "bdrLpi6.png");
loadSprite("pipeFull", "rl3cTER.png");
loadSprite("pipeTopLeft", "ReTPiWY.png");
loadSprite("pipeTopRight", "hj2GK4n.png");
loadSprite("pipeLeft", "c1cYSbt.png");
loadSprite("pipeRight", "nqQ79eI.png");

loadSprite("player", "Wb1qfhK.png");
loadSprite("enemy1", "LmseqUG.png");
loadSprite("enemy2", "SvV4ueD.png");

loadSprite("shroom", "0wMd92p.png");
loadSprite("coin", "wbKxhcd.png");

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");

  const MOVE_SPEED = 120;
  const ENEMY_MOVE_SPEED = 120;
  const JUMP_FORCE = 400;

  const maps = [
    "                                                                           ",
    "                                                                           ",
    "                                                                           ",
    "                                                                           ",
    "                                                                           ",
    "       biiiib                                                              ",
    "                                                                           ",
    "                                                                           ",
    "                                                                           ",
    "      bbibbibb                                                             ",
    "                                                                           ",
    "                                                                          ",
    "           e          e                                                    ",
    "===========================    ===================    =====================",
  ];

  const levelCfg = {
    width: 20,
    height: 20,
    "=": [sprite("redBrick"), solid()],
    b: [sprite("regBrick"), solid()],
    i: [sprite("itemBrickActive"), solid()],
    p: [sprite("pipeFull"), solid()],
    e: [sprite("enemy1"), solid()],
    p: [sprite("player"), solid()],
  };

  const gameLevel = addLevel(maps, levelCfg);

  const player = add([
    sprite("player"),
    solid(),
    pos(40, 0),
    body(),
    origin("bot"),
  ]);

  const currentScore = add([
    text("Score: "),
    pos(0, 20),
    layer("ui"),
    {
      value: "score",
    },
  ]);

  add([text("Level " + "1")]);

  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });

  keyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  keyDown("space", () => {
    if (player.grounded()) {
      player.jump(JUMP_FORCE);
    }
  });
});

start("game");
