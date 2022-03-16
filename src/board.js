const Tile = require("./tile");
const TileGroup = require("./tile-group");

class Board {
  #grid = [];
  #rows = [];
  #cols = [];

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
                : [{ count, tiles: [tile] }]
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
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      let row = this.#grid[rowIndex];

      for (let tileIndex = 0; tileIndex < row.length; tileIndex++) {
        let tile = row[tileIndex];

        if (!tile.filled) {
          let count = colCount[tileIndex];
          colCount[tileIndex] = 0;
          if (count) {
            cols[tileIndex] = [
              ...cols[tileIndex],
              { count, tiles: cols[tileIndex][cols[tileIndex].length - 1] },
            ];
          }
        } else {
          if (
            cols[tileIndex].length &&
            cols[tileIndex][cols.length - 1].count
          ) {
            cols[tileIndex] = [...cols[tileIndex], { count: 0, tiles: [] }];
          }

          colCount[tileIndex]++;
          // If it's the last tile in the row, save the current count
          if (rowIndex === grid.length - 1) {
            let count = colCount[tileIndex];
            colCount[tileIndex] = 0;
            cols[tileIndex] = [
              ...cols[tileIndex],
              { count, tiles: cols[tileIndex][cols[tileIndex].length - 1] },
            ];
          }
        }
      }
    }

    this.#cols = cols;
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

  toggleTileOpen(x, y) {
    this.#grid[y][x].toggleOpen();
  }

  toggleTileFlag(x, y) {
    this.#grid[y][x].toggleFlag();
  }
}

module.exports = Board;
