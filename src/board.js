const Tile = require("./tile");

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
                      ? { ...group, count }
                      : group;
                  })
                : [{ count: 0, tiles: [tile] }] //[...groups, finished]
              : groups;
            // If truthy...
          } else {
            // Iterate the count
            rowCount++;
            // If it's the last tile in the row, save the current count
            if (tileIndex === row.length - 1) {
              let count = rowCount;
              rowCount = 0;
              return groups.length
                ? groups.map((group, i) => {
                    return i === groups.length - 1
                      ? { count, tiles: [...group.tiles, tile] }
                      : group;
                  })
                : [{ count: 0, tiles: [tile] }]; //[...groups, finished];
            }

            return groups.length
              ? groups.map((group, i) => {
                  return i === groups.length - 1
                    ? { ...group, tiles: [...group.tiles, tile] }
                    : group;
                })
              : [{ count: 0, tiles: [tile] }];
            //tiles.length ? [...tiles, ] : [{count: 0, tiles: [tile]}];
          }
        }, []),
      ],
      []
    );

    let colCount = grid[0].map((_) => 0);
    this.#cols = grid[0].map((_) => []);
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      let row = grid[rowIndex];

      for (let tileIndex = 0; tileIndex < row.length; tileIndex++) {
        let tile = row[tileIndex];

        if (!tile) {
          let finished = colCount[tileIndex];
          colCount[tileIndex] = 0;
          if (finished) {
            this.cols[tileIndex] = [...this.cols[tileIndex], finished];
          }
        } else {
          colCount[tileIndex]++;
          // If it's the last tile in the row, save the current count
          if (rowIndex === grid.length - 1) {
            let finished = colCount[tileIndex];
            colCount[tileIndex] = 0;
            this.cols[tileIndex] = [...this.cols[tileIndex], finished];
          }
        }
      }
    }
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
