kaboom({
  global: true,
  fullscreen: true,
  scale: 1.4,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

loadSound("shrink", "../mario/sounds/shrink.wav");
loadSound("jump", "../mario/sounds/jump.wav");
loadSound("coin", "../mario/sounds/coin.wav");
loadSound("lose", "../mario/sounds/lose.wav");
loadSound("grow", "../mario/sounds/grow.wav");
loadSound("stomp", "../mario/sounds/stomp.wav");
loadSound("theme", "../mario/sounds/theme.mp3");
loadSound(
  "breakBrick",
  "https://ntmariobucket.s3.us-west-1.amazonaws.com/breakBlock.wav"
);

loadSprite("wall", "./sounds/wall.png");
loadRoot("https://i.imgur.com/");
loadSprite("regBrick", "pogC9x5.png");
loadSprite("redBrick", "M6rwarW.png");
loadSprite("blueBrick", "fVscIbn.png");
loadSprite("blueBrick2", "3e5YRQd.png");
loadSprite("steelBrick", "gqVoI2b.png");
loadSprite("coinBrickActive", "gesQ1KP.png");
loadSprite("shroomBrickActive", "gesQ1KP.png");
loadSprite("brickNotActive", "bdrLpi6.png");
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

scene("game", ({ score }) => {
  layers(["bg", "obj", "ui"], "obj");

  const MOVE_SPEED = 120;
  const ENEMY_MOVE_SPEED = -100;
  const JUMP_FORCE = 400;
  const FALL_DEATH = 400;

  // const theme = play("theme");fix later

  const maps = [
    "                                                                                                                 ",
    "                                                        ccc                                                      ",
    "                                                        ccc                                                      ",
    "                                                                                                                 ",
    "                                                                                                                 ",
    "                         iiiiii                         bmb                                      biiib           ",
    "                                                                            ccc                                  ",
    "                                                                            ccc                                  ",
    "                                                                           ccccc                                 ",
    "                        bbibbmbb                      biiiiib            bbbbbbbbb              bbbbbbb          ",
    "                                         ====                                                                    ",
    "                                         =t =                                                                  t ",
    "w                          e          e w=  =w         e        w    w     e       e   w    w   e           ew   ",
    "=================================================================    ===================    =====================",
  ];

  const levelCfg = {
    width: 20,
    height: 20,
    "=": [sprite("redBrick"), solid()],
    b: [sprite("regBrick"), solid(), "regBrick"],
    i: [sprite("coinBrickActive"), solid(), "coinBrick"],
    m: [sprite("shroomBrickActive"), solid(), "mushroomBrick"],
    t: [sprite("pipeFull"), solid()],
    e: [sprite("enemy1"), { dir: -1 }, "enemy"],
    E: [sprite("enemy2"), { dir: -1 }, "enemy"],
    p: [sprite("player"), solid()],
    c: [sprite("coin"), "coin"],
    x: [sprite("brickNotActive"), solid()],
    M: [sprite("shroom"), "shroom", body()],
    w: [sprite("wall"), "wall", scale(0.01)],
  };

  const gameLevel = addLevel(maps, levelCfg);

  const player = add([
    sprite("player"),
    solid(),
    pos(40, 0),
    body(),
    big(),
    origin("top"),
  ]);

  const currentScore = add([
    text(`Score: `),
    pos(vec2(0, 50)),
    layer("ui"),
    {
      value: 0,
    },
  ]);

  add([text("Level " + "1")]);

  function big() {
    let timer = 0;
    let isBig = false;
    return {
      update() {
        if (isBig) {
          timer -= dt();
          if (timer <= 0) {
            this.smallify();
          }
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        this.scale = vec2(1);
        timer = 0;
        isBig = false;
      },
      biggify(time) {
        this.scale = vec2(1.4);
        timer = time;
        isBig = true;
      },
    };
  }

  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });

  keyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  keyDown("space", () => {
    if (player.grounded()) {
      play("jump", {
        volume: 0.1,
        speed: 1.5,
      });
      player.jump(JUMP_FORCE);
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("coinBrick")) {
      gameLevel.spawn("c", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos.sub(0, 0));
    }
    if (obj.is("mushroomBrick")) {
      gameLevel.spawn("M", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos.sub(0, 0));
    }
    if (obj.is("regBrick") && player.isBig()) {
      destroy(obj);
      play("breakBrick", {
        volume: 0.5,
        speed: 1,
      });
    }
  });

  action("shroom", (m) => {
    m.move(30, 0);
  });

  action("enemy", (e) => {
    e.move(e.dir * ENEMY_MOVE_SPEED, 0);
  });

  collides("enemy", "wall", (s) => {
    s.dir = -s.dir;
  });

  player.collides("shroom", (s) => {
    play("grow", {
      volume: 0.5,
      speed: 0.9,
    });
    destroy(s);
    player.biggify(60);
    currentScore.value += 10;
    currentScore.text = `Score: ${currentScore.value}`;
  });

  player.collides("coin", (c) => {
    destroy(c);
    play("coin", {
      volume: 0.1,
      speed: 2.0,
    });
    currentScore.value++;
    currentScore.text = `Score: ${currentScore.value}`;
  });

  player.collides("enemy", (e) => {
    if (player.isBig()) {
      player.smallify();
      play("shrink", {
        volume: 0.5,
        speed: 1.0,
      });
      destroy(e);
    } else {
      go("lose", { score: currentScore.value });
    }
  });

  player.action(() => {
    camPos(player.pos);
    if (player.pos.y >= FALL_DEATH) {
      go("lose", { score: currentScore.value });
    }
  });
});

scene("lose", ({ score }) => {
  add([
    text(` GAME OVER \n Score: ${score}\n Play Again? (Y) `, 40),
    keyPress("y", () => {
      go("game", score);
    }),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  play("lose", {
    volume: 0.5,
    speed: 0.9,
  });
});

start("game", { score: 0 });
