class TileGroup {
  #count = 0;
  #tiles = [];

  get count() {
    return this.#count;
  }

  get tiles() {
    return this.#tiles;
  }

  addTile(tile) {
    this.#tiles.push(tile);
  }
}

module.exports = TileGroup;
