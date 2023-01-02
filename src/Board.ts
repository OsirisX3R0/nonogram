import BoardStateEnum from "./enums/BoardStateEnum";
import TileStateEnum from "./enums/TileStateEnum";
import Tile from "./Tile";
import TileGroup from "./TileGroup";

/** Options parameter for generating a new board */
type BoardOptions = {
  /** Optional amount of lives to begin the game with */
  lives?: number
}

type TileGroupParam = {
  /** Number of tiles in the group */
  count: number,
  /** Tiles in the group */
  tiles: Tile[]
}

/** The board on which the nonogram puzzle is set up and solved */
class Board {
  /** The grid layout for the board */
  private _grid: Tile[][] = [];
  /** The number groups for each row */
  private _rows: TileGroup[][] = [];
  /** The number groups for each column */
  private _cols: TileGroup[][] = [];
  /** The current status of the board */
  private _state: BoardStateEnum = BoardStateEnum.GENERATING;
  /** Amount of lives to begin the game with */
  private _lives: number = 0;

  /** Whether or not lives are being taken into account (losing is possible) */
  private usingLives(): boolean {
    return this._lives !== null;
  }

  /** Whether or not all filled tiles have been opened and empty tiles have been flagged */
  private allTilesOpened(): boolean {
    // Every filled tile has been opened and every empty tile has been flagged
    return this._grid.every((row) =>
      row.every(
        (tile) =>
          (tile.filled && tile.state === TileStateEnum.OPEN) ||
          (!tile.filled && tile.flagged)
      )
    );
  }

  /** Updates the current state */
  private refreshState() {
    // If no lives remain, FAILED
    if (this.usingLives() && this._lives <= 0) {
      this._state = BoardStateEnum.FAILED;
      // If all tiles are opened/flagged, COMPLETE
    } else if (this.allTilesOpened()) {
      this._state = BoardStateEnum.COMPLETE;
      // Otherwise, STARTED (default)
    } else {
      this._state = BoardStateEnum.STARTED;
    }
  }

  /** Toggles whether or not a tile is opened */
  private toggleTileOpen(x:number, y:number) {
    if (this._state !== BoardStateEnum.GENERATING) {
      let flagged = this._grid[y][x].flagged;
      // Open the tile
      this._grid[y][x].toggleOpen();

      // If the tile was marked wrong (and was not already flagged as wrong), deduct a life and return false
      if (!flagged && this._grid[y][x].state === TileStateEnum.WRONG) {
        if (this.usingLives()) this._lives -= 1;
        return false;
      }

      // Open the tile in any row group it belongs to
      this._rows = this._rows.map((set, setIndex) => {
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
      this._cols = this._cols.map((set, setIndex) => {
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
      for (let [setIndex, set] of this._rows.entries()) {
        if (setIndex === y && set.every((group) => group.allTilesOpened)) {
          this._grid[y] = this._grid[y].map((tile) => {
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
      for (let [setIndex, set] of this._cols.entries()) {
        if (setIndex === x && set.every((group) => group.allTilesOpened)) {
          this._grid = this._grid.map((row) =>
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

  /** Toggles whether or not a tile is flagged */
  private toggleTileFlag(x: number, y: number) {
    if (this._state !== BoardStateEnum.GENERATING) {
      // Flag the tile
      this._grid[y][x].toggleFlag();
    }
  }

  /**
    * Creates a new `Board` instance
    * @param grid 2-dimensional grid of truthy and falsy values to notate filled and empty squares, respectively
    * @param opts Additional options for the board
    */
  constructor(initialGrid: (number | boolean)[][], opts: BoardOptions = { lives: null }) {
    // Create the `Tiles` from the passed-in grid
    let grid: Tile[][] = initialGrid.map((row, y) => row.map((tile, x) => new Tile(tile, x, y)));

    // Counter for each row (reset after each, by design)
    let rowCount: number = 0;
    let rows: TileGroup[][] = grid.reduce(
      (rows, row) => [
        ...rows,
        // Check each tile in each row in the grid
        row.reduce((groups: TileGroup[], tile: Tile, tileIndex: number) => {
          // If falsey...
          if (!tile.filled) {
            // Either save the current count or continue on if it is 0
            let count = rowCount;
            rowCount = 0;
            return count
              ? groups.length
                ? groups.map((group, i) => {
                    return i === groups.length - 1
                      ? new TileGroup({ ...group, count } as TileGroupParam)
                      : group;
                  })
                : [new TileGroup({ count, tiles: [tile] })]
              : groups;
            // If truthy...
          } else {
            // If the last group is already completed, add an empty one
            if (groups.length && groups[groups.length - 1].count) {
              groups = [...groups, { count: 0, tiles: [] }] as TileGroup[];
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
    ) as TileGroup[][];

    // Array of counters for columns
    let colCount = grid[0].map((_) => 0);
    // Array of empty arrays to create column groups
    let cols: TileGroup[][] = grid[0].map((_) => []);
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
                    ? new TileGroup({ ...group, count } as TileGroupParam)
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
            cols[tileIndex] = [...cols[tileIndex], { count: 0, tiles: [] } as TileGroup];
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
                    ? { ...group, tiles: [...group.tiles, tile] } as TileGroup
                    : group;
                })
              : [{ count: 0, tiles: [tile] } as TileGroup];
          }
        }
      }
    }

    // If a row has no groups, flag all tiles
    for (let [i, rowSet] of rows.entries()) {
      if (!rowSet.length) {
        for (let tile of rowSet[i].tiles) {
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

    this._grid = grid;

    this._rows = rows;

    this._cols = cols;

    this._lives = opts.lives;

    this._state = BoardStateEnum.GENERATED;
  }

   /** The grid layout for the board */
  get grid() {
    return this._grid;
  }

   /** The number groups for each row */
  get rows() {
    return this._rows;
  }

   /** The number groups for each column */
  get cols() {
    return this._cols;
  }

   /** The current status of the board */
  get state() {
    return this._state;
  }

  /** Amount of lives to begin the game with */
  get lives() {
    return this._lives;
  }

  /** Toggles whether or not a range of tiles is opened */
  toggleOpenMany(tiles: Tile[]) {
    let cont = true;
    for (let tile of tiles) {
      // Opening many stops when a wrong tile is detected
      if (cont) cont = this.toggleTileOpen(tile.x, tile.y);
    }

    this.refreshState();
  }

  /** Toggles whether or not a range of tiles is flagged */
  toggleFlagMany(tiles: Tile[]) {
    for (let tile of tiles) {
      this.toggleTileFlag(tile.x, tile.y);
    }

    this.refreshState();
  }
}

export default Board;
