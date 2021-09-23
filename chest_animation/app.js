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

scene("open_chest", () => {
  const view = [];

  // add(view, {
  //   c: [sprite("full_chest"), solid(), "full_chest", scale(50)],
  //   t: [sprite("open_chest"), solid()],
  //   o: [sprite("top_chest"), solid()],
  //   k: [sprite("key"), solid()],
  // });

  const config = {
    width: 10,
    height: 10,
    c: [sprite("full_chest"), solid(), "full_chest"],
    t: [sprite("open_lid"), solid()],
    o: [sprite("top_chest"), solid()],
    k: [sprite("key"), solid()],
  };

  const level = addLevel(view, config);

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
    };
  }

  const chest = add([
    sprite("full_chest"),
    solid(),
    pos(vec2(width() / 4, height() / 4)),
    status(),
  ]);

  mouseClick(() => {
    if (!chest.isOpen()) {
      play("chime", {
        volume: 1,
        speed: 1,
      });
      chest.open();
      chest.changeSprite("open_lid");
    } else {
      chest.close();
      chest.changeSprite("full_chest");
    }
  });

  // chest.action(() => {
  //   chest.scale = Math.sin(kaboom.time()) * 10;
  //   chest.angle += kaboom.dt();
  // });
});

start("open_chest");
