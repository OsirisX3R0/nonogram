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
}

module.exports = TileGroup;
