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
}

module.exports = Tile;
