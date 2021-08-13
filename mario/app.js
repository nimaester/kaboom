kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

loadSound("jump", "../mario/sounds/jump.wav");
loadSound("coin", "../mario/sounds/coin.wav");
loadSound("lose", "../mario/sounds/lose.wav");
loadSound("grow", "../mario/sounds/grow.wav");
loadSound("stomp", "../mario/sounds/stomp.wav");
loadSound("theme", "../mario/sounds/theme.mp3");

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
  const ENEMY_MOVE_SPEED = -30;
  const JUMP_FORCE = 400;
  const FALL_DEATH = 400;

  // const theme = play("theme");fix later

  const maps = [
    "                                                                                                                 ",
    "                                                                                                                 ",
    "                                                                                                                 ",
    "                                                                                                                 ",
    "                                                                                                                 ",
    "                       iiiiii                              bmb                                                   ",
    "                                                                                                                 ",
    "                                                    c                                                            ",
    "                                                   ccc                                                           ",
    "                      bbibbmbb                     ccc   biiiiib                                                 ",
    "                                         ====       c                                                            ",
    "                                         =t =                                                                  t ",
    "                           e          e  =  =                                                                    ",
    "=================================================================    ===================    =====================",
  ];

  const levelCfg = {
    width: 20,
    height: 20,
    "=": [sprite("redBrick"), solid()],
    b: [sprite("regBrick"), solid()],
    i: [sprite("coinBrickActive"), solid(), "coinBrick"],
    m: [sprite("shroomBrickActive"), solid(), "mushroomBrick"],
    t: [sprite("pipeFull"), solid()],
    e: [sprite("enemy1"), solid(), body(), "enemy"],
    E: [sprite("enemy2"), solid(), body(), "enemy"],
    p: [sprite("player"), solid()],
    c: [sprite("coin"), "coin"],
    x: [sprite("brickNotActive"), solid()],
    M: [sprite("shroom"), "shroom", body()],
  };

  const gameLevel = addLevel(maps, levelCfg);
  let isJumping = true;

  const player = add([
    sprite("player"),
    solid(),
    pos(40, 0),
    body(),
    big(),
    origin("bot"),
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
        this.scale = vec2(1.3);
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
      isJumping = true;
      play("jump", {
        volume: 0.1,
        speed: 1.5,
      });
      player.jump(JUMP_FORCE);
    } else if (player.falling()) {
      isJumping = true;
    }
  });

  player.action(() => {
    if (player.grounded()) {
      isJumping = false;
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
  });

  action("shroom", (m) => {
    m.move(20, 0);
  });

  action("enemy", (e) => {
    e.move(ENEMY_MOVE_SPEED, 0);
  });

  player.collides("shroom", (s) => {
    play("grow", {
      volume: 0.1,
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
    if (isJumping) {
      // theme.stop();
      destroy(e);
      currentScore.value++;
      currentScore.text = `Score: ${currentScore.value}`;
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
    text(`GAME OVER \nScore: ${score}\nPlay Again? (Y)`, 40),
    keyPress("y", () => {
      go("game", score);
    }),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  play("lose", {
    volume: 0.1,
    speed: 0.9,
  });
});

start("game", { score: 0 });
