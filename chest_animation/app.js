kaboom({
  global: true,
  fullscreen: true,
  clearColor: [0, 0, 0, 1],
  crisp: true,
});
loadSound("chime", "./img/chime.mp3");
loadSprite("full_chest", "./img/chest.png");
loadSprite("open_lid", "./img/open_lid.png");
loadSprite("top_chest", "./img/top.png");
loadSprite("key", "./img/key.png");
loadSprite("wallpaper", "./img/wallpaper.jpeg");

scene("open_chest", () => {
  layers(["bg", "ui"]);

  const config = {
    c: [sprite("full_chest"), solid(), "full_chest", scale(0.5)],
    t: [sprite("open_lid"), solid()],
    o: [sprite("top_chest"), solid()],
    k: [sprite("key"), solid()],
  };

  // add([sprite("wallpaper"), pos(0, 0), origin("topleft"), layer("bg")]);

  function status() {
    let isOpen = false;
    return {
      isOpen() {
        return isOpen;
      },
      close() {
        isOpen = false;
      },
      open() {
        isOpen = true;
      },
      shake() {},
    };
  }

  // const wallpaper = add([layer("bg"), sprite("wallpaper"), origin("center")]);

  const chest = add([
    layer("ui"),
    sprite("full_chest"),
    solid(),
    origin("center"),
    status(),
    scale(0.5),
    rotate(0),
    pos(160, 120),
  ]);

  chest.action(() => {
    camPos(chest.pos);
  });

  mouseClick(() => {
    if (!chest.isOpen()) {
      chest.open();
      camShake(10);
      setTimeout(() => {
        chest.changeSprite("open_lid");
        play("chime", {
          volume: 1,
          speed: 1,
        });
      }, 1700);
    } else {
      chest.close();
      chest.changeSprite("full_chest");
    }
  });

  focus();
});

start("open_chest");
