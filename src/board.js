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
    let opened = this.#grid.every((row) =>
      row.every((tile) => tile.state === TileStateEnum.OPEN)
    );

    return opened;
  }

  #refreshState() {
    if (this.#allTilesOpened) {
      this.#state = BoardStateEnum.COMPLETE;
    } else {
      this.#state = BoardStateEnum.STARTED;
    }
  }

  #toggleTileOpen(x, y) {
    this.#grid[y][x].toggleOpen();

    for (let rowSet in this.#rows) {
      for (let rowGroup in rowSet) {
        for (let rowTile in rowGroup) {
          if (rowTile.x === x && rowTile.y === y) rowTile.toggleOpen();
        }

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
          if (colTile.x === x && colTile.y === y) colTile.toggleOpen();
        }

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
    this.#grid[y][x].toggleFlag();

    for (let rowSet in this.#rows) {
      for (let rowGroup in rowSet) {
        for (let rowTile in rowGroup) {
          if (rowTile.x === x && rowTile.y === y) rowTile.toggleFlag();
        }
      }
    }

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
    this.#grid = grid.map((row, y) =>
      row.map((tile, x) => new Tile(tile, x, y))
    );

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

    let colCount = this.#grid[0].map((_) => 0);
    let cols = this.#grid[0].map((_) => []);
    for (let [rowIndex, row] of this.#grid.entries()) {
      // let row = this.#grid[rowIndex];

      for (let [tileIndex, tile] of row.entries()) {
        // let tile = row[tileIndex];

        if (!tile.filled) {
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
        } else {
          if (
            cols[tileIndex].length &&
            cols[tileIndex][cols[tileIndex].length - 1].count
          ) {
            cols[tileIndex] = [...cols[tileIndex], { count: 0, tiles: [] }];
          }

          colCount[tileIndex]++;
          // If it's the last tile in the row, save the current count
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
