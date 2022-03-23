const TileStateEnum = require("./enums/TileStateEnum");

class TileGroup {
  #count = 0;
  #tiles = [];

  constructor(group) {
    this.#count = group.count;
    this.#tiles = group.tiles;
  }

  get count() {
    return this.#count;
  }

  get tiles() {
    return this.#tiles;
  }

  get allTilesOpened() {
    return this.#tiles.every((tile) => tile.state === TileStateEnum.OPEN);
  }

  openTile(x, y) {
    this.#tiles = this.#tiles.map((tile) => {
      if (tile.x === x && tile.y === y) tile.toggleOpen();
      return tile;
    });
  }
}

module.exports = TileGroup;
