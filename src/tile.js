const TileFlaggedEnum = require("./enums/TileFlaggedEnum");
const TileStateEnum = require("./enums/TileStateEnum");

class Tile {
  #x = 0;
  #y = 0;
  #filled = false;
  #wrong = false;
  #state = TileStateEnum.CLOSED;
  #flag = TileFlaggedEnum.UNFLAGGED;

  constructor(value, x, y) {
    this.#x = x;
    this.#y = y;
    this.#filled = value ? true : false;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get filled() {
    return this.#filled;
  }

  get wrong() {
    return this.#wrong;
  }

  get state() {
    return this.#state;
  }

  get flag() {
    return this.#flag;
  }

  toggleOpen() {
    // If the space is not filled, flag it and mark it as wrong
    if (!this.#filled) {
      this.toggleFlag();
      this.#wrong = true;
      return;
    }

    // Otherwise, toggle it open/close
    this.#state =
      this.#state === TileStateEnum.CLOSED
        ? TileStateEnum.OPEN
        : TileStateEnum.CLOSED;
  }

  toggleFlag() {
    this.#flag =
      this.#flag === TileFlaggedEnum.UNFLAGGED
        ? TileFlaggedEnum.FLAGGED
        : TileFlaggedEnum.UNFLAGGED;
  }
}

module.exports = Tile;
