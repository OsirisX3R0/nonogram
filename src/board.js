const BoardStateEnum = require("./enums/BoardStateEnum");
const TileStateEnum = require("./enums/TileStateEnum");
const Tile = require("./tile");
const TileGroup = require("./tile-group");

class Board {
  #grid = [];
  #rows = [];
  #cols = [];
  #state = BoardStateEnum.GENERATING;
  #lives = 0;

  get #usingLives() {
    return this.#lives !== null;
  }

  get #allTilesOpened() {
    // Every filled tile has been opened and every empty tile has been flagged
    return this.#grid.every((row) =>
      row.every(
        (tile) =>
          (tile.filled && tile.state === TileStateEnum.OPEN) ||
          (!tile.filled && tile.flagged)
      )
    );
  }

  #refreshState() {
    // If no lives remain, FAILED
    if (this.#usingLives && this.#lives <= 0) {
      this.#state = BoardStateEnum.FAILED;
      // If all tiles are opened/flagged, COMPLETE
    } else if (this.#allTilesOpened) {
      this.#state = BoardStateEnum.COMPLETE;
      // Otherwise, STARTED (default)
    } else {
      this.#state = BoardStateEnum.STARTED;
    }
  }

  #toggleTileOpen(x, y) {
    if (this.#state !== BoardStateEnum.GENERATING) {
      let flagged = this.#grid[y][x].flagged;
      // Open the tile
      this.#grid[y][x].toggleOpen();

      // If the tile was marked wrong (and was not already flagged as wrong), deduct a life and return false
      if (flagged && this.#grid[y][x].state === TileStateEnum.WRONG) {
        if (this.#usingLives) this.#lives -= 1;
        return false;
      }

      // Open the tile in any row group it belongs to
      this.#rows = this.#rows.map((set, setIndex) => {
        return setIndex !== y
          ? set
          : set.map((group) => {
              group.openTile(x, y);

              if (group.allTilesOpened) {
              }

              return group;
            });
      });

      // Open the tile in any column group it belongs to
      this.#cols = this.#cols.map((set, setIndex) => {
        return setIndex !== x
          ? set
          : set.map((group) => {
              group.openTile(x, y);

              if (group.allTilesOpened) {
              }

              return group;
            });
      });

      // If every filled tile in the row is opened, flag the rest of the row
      for (let [setIndex, set] of this.#rows.entries()) {
        if (setIndex === y && set.every((group) => group.allTilesOpened)) {
          this.#grid[y] = this.#grid[y].map((tile) => {
            if (
              !tile.filled &&
              tile.state === TileStateEnum.CLOSED &&
              !tile.flagged
            )
              tile.toggleFlag();

            return tile;
          });
        }
      }

      // If every filled tile in the column is opened, flag the rest of the column
      for (let [setIndex, set] of this.#cols.entries()) {
        if (setIndex === x && set.every((group) => group.allTilesOpened)) {
          this.#grid = this.#grid.map((row) =>
            row.map((tile) => {
              if (
                tile.x === x &&
                !tile.filled &&
                tile.state === TileStateEnum.CLOSED &&
                !tile.flagged
              )
                tile.toggleFlag();

              return tile;
            })
          );
        }
      }

      // Return true when everything goes as planned
      return true;
    }
  }

  #toggleTileFlag(x, y) {
    if (this.#state !== BoardStateEnum.GENERATING) {
      // Flag the tile
      this.#grid[y][x].toggleFlag();
    }
  }

  constructor(grid, opts = { lives: null }) {
    // Create the `Tiles` from the passed-in grid
    grid = grid.map((row, y) => row.map((tile, x) => new Tile(tile, x, y)));

    // Counter for each row (reset after each, by design)
    let rowCount = 0;
    let rows = grid.reduce(
      (rows, row) => [
        ...rows,
        // Check each tile in each row in the grid
        row.reduce((groups, tile, tileIndex) => {
          // If falsey...
          if (!tile.filled) {
            // Either save the current count or continue on if it is 0
            let count = rowCount;
            rowCount = 0;
            return count
              ? groups.length
                ? groups.map((group, i) => {
                    return i === groups.length - 1
                      ? new TileGroup({ ...group, count })
                      : group;
                  })
                : [new TileGroup({ count, tiles: [tile] })]
              : groups;
            // If truthy...
          } else {
            // If the last group is already completed, add an empty one
            if (groups.length && groups[groups.length - 1].count) {
              groups = [...groups, { count: 0, tiles: [] }];
            }
            // Iterate the count
            rowCount++;
            // If it's the last tile in the row, save the current count
            if (tileIndex === row.length - 1) {
              let count = rowCount;
              rowCount = 0;
              return groups.length
                ? groups.map((group, i) => {
                    return i === groups.length - 1
                      ? new TileGroup({ count, tiles: [...group.tiles, tile] })
                      : group;
                  })
                : [{ count: 0, tiles: [tile] }];
            }

            return groups.length
              ? groups.map((group, i) => {
                  return i === groups.length - 1
                    ? { ...group, tiles: [...group.tiles, tile] }
                    : group;
                })
              : [{ count: 0, tiles: [tile] }];
          }
        }, []),
      ],
      []
    );

    // Array of counters for columns
    let colCount = grid[0].map((_) => 0);
    // Array of empty arrays to create column groups
    let cols = grid[0].map((_) => []);
    // Check each tile in each row in the grid
    for (let [rowIndex, row] of grid.entries()) {
      for (let [tileIndex, tile] of row.entries()) {
        // If falsey...
        if (!tile.filled) {
          // Either save the current column count or skip ahead
          let count = colCount[tileIndex];
          colCount[tileIndex] = 0;
          if (count) {
            cols[tileIndex] = cols[tileIndex].length
              ? cols[tileIndex].map((group, i) => {
                  return i === cols[tileIndex].length - 1
                    ? new TileGroup({ ...group, count })
                    : group;
                })
              : [new TileGroup({ count, tiles: [tile] })];
          }
          // If truthy...
        } else {
          // If the last group is already completed, add an empty one
          if (
            cols[tileIndex].length &&
            cols[tileIndex][cols[tileIndex].length - 1].count
          ) {
            cols[tileIndex] = [...cols[tileIndex], { count: 0, tiles: [] }];
          }

          // Iterate the count
          colCount[tileIndex]++;
          // If it's the last row in the grid, save the current count
          if (rowIndex === grid.length - 1) {
            let count = colCount[tileIndex];
            colCount[tileIndex] = 0;
            cols[tileIndex] = cols[tileIndex].length
              ? cols[tileIndex].map((group, i) => {
                  return i === cols[tileIndex].length - 1
                    ? new TileGroup({ count, tiles: [...group.tiles, tile] })
                    : group;
                })
              : [new TileGroup({ count, tiles: [tile] })];
          } else {
            cols[tileIndex] = cols[tileIndex].length
              ? cols[tileIndex].map((group, i) => {
                  return i === cols[tileIndex].length - 1
                    ? { ...group, tiles: [...group.tiles, tile] }
                    : group;
                })
              : [{ count: 0, tiles: [tile] }];
          }
        }
      }
    }

    // If a row has no groups, flag all tiles
    for (let [i, rowSet] of rows.entries()) {
      if (!rowSet.length) {
        for (let tile of rowSet[i]) {
          tile.toggleFlag();
        }
      }
    }

    // If a column has no groups, flag all tiles
    for (let [i, colSet] of cols.entries()) {
      if (!colSet.length) {
        for (let row of grid) {
          row[i].toggleFlag();
        }
      }
    }

    this.#grid = grid;

    this.#rows = rows;

    this.#cols = cols;

    this.#lives = opts.lives;

    this.#state = BoardStateEnum.GENERATED;
  }

  get grid() {
    return this.#grid;
  }

  get rows() {
    return this.#rows;
  }

  get cols() {
    return this.#cols;
  }

  get state() {
    return this.#state;
  }

  get lives() {
    return this.#lives;
  }

  toggleOpenMany(tiles) {
    let cont = true;
    for (let tile of tiles) {
      // Opening many stops when a wrong tile is detected
      if (cont) cont = this.#toggleTileOpen(tile.x, tile.y);
    }

    this.#refreshState();
  }

  toggleFlagMany(tiles) {
    for (let tile of tiles) {
      this.#toggleTileFlag(tile.x, tile.y);
    }

    this.#refreshState();
  }
}

module.exports = Board;
