type TruthyOrFalsy = number | boolean

class Board {
  /** The grid layout for the board */
  private #grid: TruthyOrFalsy[][]
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
  private grid: () => TruthyOrFalsy[][]
  /** The number groups for each row */
  private rows: () => number[][]
  /** The number groups for each column */
  private cols: () => number[][]
}