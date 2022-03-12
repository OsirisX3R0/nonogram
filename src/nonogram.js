const { ModuleKind } = require("typescript");
const TileFilledEnum = require("./enums/TileFilledEnum");
const TileFlaggedEnum = require("./enums/TileFlaggedEnum");
const TileStateEnum = require("./enums/TileStateEnum");

class Tile {
  /**
   * Creates a new `Tile` instance
   * @param {Number | Boolean} value Truthy/falsy value indicating whether or not the tile is filled
   */
  constructor(value, x, y) {
    this.x = x;
    this.y = y;
    this.filled = value ? TileFilledEnum.FILLED : TileFilledEnum.EMPTY;
    this.state = TileStateEnum.CLOSED;
    this.flagged = TileFlaggedEnum.UNFLAGGED;
  }
}

class Board {
  /**
   * Creates a new `Board` instance
   * @param {Object[][]} grid 2-dimensional grid of 1s and 0s to notate filled and empty squares, respectively
   */
  constructor(grid) {
    let rowCount = 0;

    this._grid = grid.map((row, y) =>
      row.map((tile, x) => new Tile(tile, x, y))
    );

    this._numbers = {
      rows: grid.reduce((rows, row) => {
        return [
          ...rows,
          row.reduce((tiles, tile) => {
            if (!tile) {
              let finished = rowCount;
              rowCount = 0;
              return rowCount ? [...tiles, finished] : tiles;
            } else {
              rowCount++;
              return tiles;
            }
          }, []),
        ];
      }, []),
      columns: grid.reduce((rows, row, rowIndex) => {
        return [
          ...rows,
          row.reduce((tiles, tile, tileIndex) => {
            let updatedTiles = [];

            if (!tiles[tileIndex]) {
              return [...tiles, tile ? 1 : 0];
            } else {
              updatedTiles = tiles.map((x, i) =>
                i === tiles[tileIndex] ? (tile ? x++ : x) : x
              );
            }

            return updatedTiles;
          }, []),
        ];
      }, []),
    };
  }
}

module.exports = { Tile, Board };
