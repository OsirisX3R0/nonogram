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

  // addTile(tile) {
  //   this.#tiles.push(tile);
  // }
}

module.exports = TileGroup;
