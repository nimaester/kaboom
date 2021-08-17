kaboom({
  global: true,
  fullscreen: true,
  scale: 1.4,
  debug: true,
  clearColor: [0, 0, 0, 1],
  crisp: true,
});

// sounds
loadSound(
  "shrink",
  "https://ntmariobucket.s3.us-west-1.amazonaws.com/shrink.wav"
);
loadSound("jump", "https://ntmariobucket.s3.us-west-1.amazonaws.com/jump.wav");
loadSound(
  "enterPipe",
  "https://ntmariobucket.s3.us-west-1.amazonaws.com/enterPipe.wav"
);
loadSound("coin", "https://ntmariobucket.s3.us-west-1.amazonaws.com/coin.wav");
loadSound("lose", "https://ntmariobucket.s3.us-west-1.amazonaws.com/lose.wav");
loadSound("grow", "https://ntmariobucket.s3.us-west-1.amazonaws.com/grow.wav");
loadSound(
  "stomp",
  "https://ntmariobucket.s3.us-west-1.amazonaws.com/stomp.wav"
);
loadSound(
  "theme",
  "https://ntmariobucket.s3.us-west-1.amazonaws.com/theme.mp3"
);
loadSound(
  "breakBrick",
  "https://ntmariobucket.s3.us-west-1.amazonaws.com/breakBlock.wav"
);

// sprites
loadSprite("wall", "https://ntmariobucket.s3.us-west-1.amazonaws.com/wall.png");
loadSprite(
  "portal",
  "https://ntmariobucket.s3.us-west-1.amazonaws.com/wall.png"
);
loadSprite(
  "player",
  "https://ntmariobucket.s3.us-west-1.amazonaws.com/mario.png"
);
loadSprite(
  "player-reverse",
  "https://ntmariobucket.s3.us-west-1.amazonaws.com/mario-reverse.png"
);
loadRoot("https://i.imgur.com/");
loadSprite("regBrick", "pogC9x5.png");
loadSprite("redBrick", "M6rwarW.png");
loadSprite("blueBrick", "fVscIbn.png");
loadSprite("blueRegBrick", "3e5YRQd.png");
loadSprite("steelBrick", "gqVoI2b.png");
loadSprite("coinBrickActive", "gesQ1KP.png");
loadSprite("shroomBrickActive", "gesQ1KP.png");
loadSprite("brickNotActive", "bdrLpi6.png");
loadSprite("pipeFull", "rl3cTER.png");
loadSprite("pipeTopLeft", "ReTPiWY.png");
loadSprite("pipeTopRight", "hj2GK4n.png");
loadSprite("pipeLeft", "c1cYSbt.png");
loadSprite("pipeRight", "nqQ79eI.png");

loadSprite("enemy1", "LmseqUG.png");
loadSprite("enemy2", "SvV4ueD.png");

loadSprite("shroom", "0wMd92p.png");
loadSprite("coin", "wbKxhcd.png");

scene("game", ({ score, level }) => {
  layers(["bg", "obj", "ui"], "obj");

  // speed of objects such as player, enemies, items
  const MOVE_SPEED = 120;
  const ENEMY_MOVE_SPEED = 100;
  const JUMP_FORCE = 400;
  const FALL_DEATH = 400;

  // map layouts
  const maps = [
    [
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
      "                                         ====                                                                  WW",
      "                                         =t =                                                                  t ",
      "w                          e          e w=  =w         e        w    w     e       e   w    w   e           ew   ",
      "=================================================================    ===================    =====================",
    ],
    [
      "                                                                                                                 ",
      "                                                   c                                                             ",
      "                                                 ccccc                                                           ",
      "                                                ccccccc                                                          ",
      "                                                 ccccc                                  cc                       ",
      "          BiiiiB                                                                       cccc                      ",
      "                                              BBBB    BBBB                            cccccc                     ",
      "                                            BBBB        BBBB                            cc                       ",
      "                                          BBBB            BBBB                                                   ",
      "         BBBmmBBB                       BBBBB      ()       BBBB                      BBBBBB                     ",
      "                                                 ()[]()                                                        WW",
      "                                                 [][][]                                                        t ",
      "w                e       w    we                w[][][]w       e    w    w  e                          e     w   ",
      "SSSSSSSSSSSSSSSSSSSSSSSSSS    SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS    SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
    ],
  ];

  let levelCfg = {
    width: 20,
    height: 20,
    "=": [sprite("redBrick"), solid()],
    b: [sprite("regBrick"), solid(), "regBrick"],
    s: [sprite("steelBrick"), solid(), "steelBrick", scale(0.5)],
    B: [sprite("blueRegBrick"), solid(), "blueRegBrick", scale(0.5)],
    S: [sprite("blueBrick"), solid(), "blueBrick", scale(0.5)],
    "[": [sprite("pipeLeft"), solid(), "pipeLeft", scale(0.5)],
    "]": [sprite("pipeRight"), solid(), "pipeRight", scale(0.5)],
    "(": [sprite("pipeTopLeft"), solid(), "pipeTopLeft", scale(0.5)],
    ")": [sprite("pipeTopRight"), solid(), "pipeTopRight", scale(0.5)],
    i: [sprite("coinBrickActive"), solid(), "coinBrick"],
    m: [sprite("shroomBrickActive"), solid(), "mushroomBrick"],
    t: [sprite("pipeFull"), solid(), "pipeFull"],
    e: [sprite("enemy1"), { dir: -1 }, "enemy"],
    E: [sprite("enemy2"), { dir: -1 }, "enemy"],
    p: [sprite("player"), solid()],
    P: [sprite("player-reverse"), solid()],
    c: [sprite("coin"), "coin"],
    x: [sprite("brickNotActive"), solid()],
    M: [sprite("shroom"), "shroom", body()],
    w: [sprite("wall"), "wall", scale(0.01)],
    W: [sprite("portal"), "portal", scale(0.01)],
  };

  const gameLevel = addLevel(maps[level], levelCfg);

  const player = add([
    sprite("player"),
    solid(),
    pos(20, 0),
    body(),
    big(),
    origin("bot"),
  ]);

  const currentScore = add([
    text(`Score: ${score}`),
    pos(vec2(0, 50)),
    layer("ui"),
    {
      value: score,
    },
  ]);

  add([text("Level: " + parseInt(level + 1)), pos(0, 25)]);

  // makes player big able to break bricks and take damage from enemies
  function big() {
    let timer = 0;
    let isBig = false;
    let direction = "right";
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

  // commands
  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
    player.changeSprite("player-reverse");
  });

  keyDown("right", () => {
    player.move(MOVE_SPEED, 0);
    player.changeSprite("player");
  });

  keyDown("space", () => {
    if (player.grounded()) {
      play("jump", {
        volume: 0.2,
        speed: 1.5,
      });
      player.jump(JUMP_FORCE);
    }
  });

  // actions
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
    if ((obj.is("regBrick") || obj.is("blueRegBrick")) && player.isBig()) {
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

  player.collides("portal", () => {
    keyDown("down", () => {
      play("enterPipe", {
        volume: 0.2,
        speed: 1,
      });
      go("game", {
        level: (level + 1) % maps.length,
        score: currentScore.value,
      });
    });
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
    camScale(1.5);
    if (player.pos.y >= FALL_DEATH) {
      go("lose", { score: currentScore.value });
    }
  });
});

// game over scene
scene("lose", ({ score, level }) => {
  add([
    text(` GAME OVER \n Score: ${score}\n Play Again? (Y) `, 40),
    keyPress("y", () => {
      go("game", { score: 0, level: 0 });
    }),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  play("lose", {
    volume: 0.5,
    speed: 0.9,
  });
});

// starts the game
start("game", { score: 0, level: 0 });
