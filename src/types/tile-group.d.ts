import Tile from "./tile"

/** A group, meant to be used to instantiate a `TileGroup` */
type Group = {
  count: number,
  tiles: Tile[]
}

/** The groups of filled spaces in each column/row on the puzzle */
class TileGroup {
/** The number of tiles in the group */
  private #count: number
  /** The tiles included in the group */
  private #tiles: Tile[]

  /**
   * Creates a new `TileGroup` instance
   * @param Group Group to create
   */
  constructor(group: Group)

  /** The number of tiles in the group */
  count: () => number
  /** The tiles included in the group */
  tiles: () => Tile[]
  /** Whether or not all tiles have been opened */
  allTilesOpened: () => boolean
}