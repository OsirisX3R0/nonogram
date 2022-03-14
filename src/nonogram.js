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
    this.grid = grid.map((row, y) =>
      row.map((tile, x) => new Tile(tile, x, y))
    );

    let rowCount = 0;
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

    let colCount = grid[0].map((_) => 0);
    this.colNumbers = grid[0].map((_) => []);
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      let updated = [];
      let row = grid[rowIndex];

      for (let tileIndex = 0; tileIndex < row.length; tileIndex++) {
        let tile = row[tileIndex];

        if (!tile) {
          let finished = colCount[tileIndex];
          colCount[tileIndex] = 0;
          if (finished) {
            this.colNumbers[tileIndex] = [
              ...this.colNumbers[tileIndex],
              finished,
            ];
          }
        } else {
          colCount[tileIndex]++;
          // If it's the last tile in the row, save the current count
          if (rowIndex === grid.length - 1) {
            let finished = colCount[tileIndex];
            colCount[tileIndex] = 0;
            this.colNumbers[tileIndex] = [
              ...this.colNumbers[tileIndex],
              finished,
            ];
          }

          // return tiles;
        }
      }
    }
  }
}

module.exports = { Tile, Board };
