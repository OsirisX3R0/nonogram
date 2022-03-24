import BoardStateEnum from "../enums/types/BoardStateEnum"
import { Tile } from "./tile"
import { TileGroup } from "./tile-group"

/** A truthy or falsy value, meant to be numeric (1 | 0) or boolean (true | false) */
type TruthyOrFalsy = number | boolean

type BoardOptions = {
  lives?: number
}

/** The board on which the nonogram puzzle is set up and solved */
class Board {
  /** The grid layout for the board */
  private #grid: Tile[][]
  /** The number groups for each row */
  private #rows: TileGroup[][]
  /** The number groups for each column */
  private #cols: TileGroup[][]
  /** The current status of the board */
  private #state: BoardStateEnum

  /** Whether or not lives are being taken into account (losing is possible) */
  private #usingLives: () => boolean
  /** Whether or not all filled tiles have been opened and empty tiles have been flagged */
  private #allTilesOpened: () => boolean
  /** Updates the current state */
  private #refreshState: () => void
  /** Toggles whether or not a tile is opened */
  private #toggleTileOpen(x: number, y: number): boolean

  /** Toggles whether or not a tile is flagged */
  private #toggleTileFlag(x: number, y: number): void

  /**
   * Creates a new `Board` instance
   * @param {Object[][]} grid 2-dimensional grid of truthy and falsy values to notate filled and empty squares, respectively
   * @param {BoardOptions} opts Additional options for the board
   */
  constructor(grid: TruthyOrFalsy[][], opts: BoardOptions)
  
  /** The grid layout for the board */
  grid: () => Tile[][]
  /** The number groups for each row */
  rows: () => TileGroup[][]
  /** The number groups for each column */
  cols: () => TileGroup[][]
  /** The current status of the board */
  state: () => BoardStateEnum

  /** Toggles whether or not a range of tiles is opened */
  toggleOpenMany(range: Tile[]): void
  /** Toggles whether or not a range of tiles is flagged */
  toggleFlagMany(range: Tile[]): void
}

export default Board