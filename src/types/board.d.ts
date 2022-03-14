import { Tile } from "./tile"

type TruthyOrFalsy = number | boolean

class Board {
  /** The grid layout for the board */
  private #grid: Tile[][]
  /** The number groups for each row */
  private #rows: number[][]
  /** The number groups for each column */
  private #cols: number[][]

  /**
   * Creates a new `Board` instance
   * @param {Object[][]} grid 2-dimensional grid of 1s and 0s to notate filled and empty squares, respectively
   */
  constructor(grid: TruthyOrFalsy[][])
  
  /** The grid layout for the board */
  grid: () => Tile[][]
  /** The number groups for each row */
  rows: () => number[][]
  /** The number groups for each column */
  cols: () => number[][]

  /** Toggles whther or not a tile is opened */
  toggleTileOpen(x: number, y: number): void
  /** Toggles whther or not a tile is flagged */
  toggleTileFlag(x: number, y: number): void
}