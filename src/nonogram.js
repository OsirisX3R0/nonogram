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
    this.filled = value ? true : false;
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

    this.grid = grid.map((row, y) =>
      row.map((tile, x) => new Tile(tile, x, y))
    );

    this.rowNumbers = grid.reduce(
      (rows, row) => [
        ...rows,
        // Check each tile in each row in the grid
        row.reduce((tiles, tile, tileIndex) => {
          // If falsey...
          if (!tile) {
            // Either save the current count or continue on if it is 0
            let finished = rowCount;
            rowCount = 0;
            return finished ? [...tiles, finished] : tiles;
            // If truthy...
          } else {
            // Iterate the count
            rowCount++;
            // If it's the last tile in the row, save the current count
            if (tileIndex === row.length - 1) {
              let finished = rowCount;
              rowCount = 0;
              return [...tiles, finished];
            }

            return tiles;
          }
        }, []),
      ],
      []
    );

    this.colNumbers = grid.reduce((rows, row, rowIndex) => {
      return row.reduce((tiles, tile, tileIndex) => {
        let updatedTiles = [];

        if (!tiles[tileIndex]) {
          return [...tiles, tile ? 1 : 0];
        } else {
          updatedTiles = tiles.map((x, i) =>
            i === tiles[tileIndex] ? (tile ? x++ : x) : x
          );
        }

        return updatedTiles;
      }, []);
    }, []);
  }
}

module.exports = { Tile, Board };
