const TileFlaggedEnum = require("./enums/TileFlaggedEnum");
const TileStateEnum = require("./enums/TileStateEnum");

class Tile {
  constructor(value, x, y) {
    this.x = x;
    this.y = y;
    this.filled = value ? true : false;
    this.state = TileStateEnum.CLOSED;
    this.flag = TileFlaggedEnum.UNFLAGGED;
  }

  toggleOpen() {
    this.state === TileStateEnum.CLOSED
      ? TileStateEnum.OPEN
      : TileStateEnum.CLOSED;
  }

  toggleFlag() {
    this.flag === TileFlaggedEnum.UNFLAGGED
      ? TileFlaggedEnum.FLAGGED
      : TileFlaggedEnum.UNFLAGGED;
  }
}

module.exports = Tile;
