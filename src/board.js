const BoardStateEnum = require("./enums/BoardStateEnum");
const TileFlaggedEnum = require("./enums/TileFlaggedEnum");
const TileStateEnum = require("./enums/TileStateEnum");
const Tile = require("./tile");
const TileGroup = require("./tile-group");

class Board {
  #grid = [];
  #rows = [];
  #cols = [];
  #state = BoardStateEnum.GENERATING;

  get #allTilesOpened() {
    return this.#grid.every((row) =>
      row.every((tile) => tile.state === TileStateEnum.OPEN)
    );
  }

  #refreshState() {
    if (this.#allTilesOpened) {
      this.#state = BoardStateEnum.COMPLETE;
    } else {
      this.#state = BoardStateEnum.STARTED;
    }
  }

  #toggleTileOpen(x, y) {
    // Open the tile
    this.#grid[y][x].toggleOpen();

    for (let rowSet in this.#rows) {
      for (let rowGroup in rowSet) {
        for (let rowTile in rowGroup) {
          // Find any matches in row groups and open them as well
          if (rowTile.x === x && rowTile.y === y) rowTile.toggleOpen();
        }

        // If all tiles in all of the row group are opened, flag the rest of the row
        if (rowGroup.every((tile) => tile.state === TileStateEnum.OPEN)) {
          for (let tile in this.#grid[y]) {
            if (!tile.filled && tile.flagged === TileFlaggedEnum.UNFLAGGED) {
              tile.toggleFlag();
            }
          }
        }
      }
    }

    for (let colSet in this.#cols) {
      for (let colGroup in colSet) {
        for (let colTile in colGroup) {
          // Find any matches in column groups and open them as well
          if (colTile.x === x && colTile.y === y) colTile.toggleOpen();
        }

        // If all tiles in all of the column group are opened, flag the rest of the column
        if (colGroup.every((tile) => tile.state === TileStateEnum.OPEN)) {
          for (let row in this.#grid) {
            for (let tile in row) {
              if (
                tile.x === x &&
                !tile.filled &&
                tile.flagged === TileFlaggedEnum.UNFLAGGED
              ) {
                tile.toggleFlag();
              }
            }
          }
        }
      }
    }

    this.#refreshState();
  }

  #toggleTileFlag(x, y) {
    // Flag the tile
    this.#grid[y][x].toggleFlag();

    // Find any matches in row groups and flag them as well
    for (let rowSet in this.#rows) {
      for (let rowGroup in rowSet) {
        for (let rowTile in rowGroup) {
          if (rowTile.x === x && rowTile.y === y) rowTile.toggleFlag();
        }
      }
    }

    // Find any matches in column groups and flag them as well
    for (let colSet in this.#cols) {
      for (let colGroup in colSet) {
        for (let colTile in colGroup) {
          if (colTile.x === x && colTile.y === y) colTile.toggleFlag();
        }
      }
    }

    this.#refreshState();
  }

  constructor(grid) {
    // Create the `Tiles` from the passed-in grid
    this.#grid = grid.map((row, y) =>
      row.map((tile, x) => new Tile(tile, x, y))
    );

    // Counter for each row (reset after each, by design)
    let rowCount = 0;
    this.#rows = this.#grid.reduce(
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
    let colCount = this.#grid[0].map((_) => 0);
    // Array of empty arrays to create column groups
    let cols = this.#grid[0].map((_) => []);
    // Check each tile in each row in the grid
    for (let [rowIndex, row] of this.#grid.entries()) {
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
                    ? new TileGroup({ ...group, tiles: [...group.tiles, tile] })
                    : group;
                })
              : [{ count: 0, tiles: [tile] }];
          }
        }
      }
    }

    this.#cols = cols;

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

  toggleTileOpenRange(tiles) {
    for (let tile of tiles) {
      this.#toggleTileOpen(tile.x, tile.y);
    }
  }

  toggleTileFlagRange(tiles) {
    for (let tile of tiles) {
      this.#toggleTileFlag(tile.x, tile.y);
    }
  }
}

module.exports = Board;
