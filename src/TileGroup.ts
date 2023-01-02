import TileStateEnum from "./enums/TileStateEnum";
import Tile from './Tile'

/** A group, meant to be used to instantiate a `TileGroup` */
type TileGroupParam = {
  /** Number of tiles in the group */
  count: number,
  /** Tiles in the group */
  tiles: Tile[]
}

/** The groups of filled spaces in each column/row on the puzzle */
class TileGroup {
 /** The number of tiles in the group */
  private _count: number = 0;
   /** The tiles included in the group */
  private _tiles: Tile[] = [];

  /**
    * Creates a new `TileGroup` instance
    * @param group Group to create
    */
  constructor(group: TileGroupParam) {
    this._count = group.count;
    this._tiles = group.tiles;
  }

 /** The number of tiles in the group */
  get count(): number {
    return this._count;
  }

   /** The tiles included in the group */
  get tiles(): Tile[] {
    return this._tiles;
  }

  /** Whether or not all tiles have been opened */
  get allTilesOpened(): boolean {
    return this._tiles.every((tile) => tile.state === TileStateEnum.OPEN);
  }

  /**
    * Opens a `Tile` in the `TileGroup`
    * @param x column index of the `Tile` to open
    * @param y row index of the `Tile` to open
    */
  openTile(x: number, y: number): void {
    this._tiles = this._tiles.map((tile) => {
      if (tile.x === x && tile.y === y) tile.toggleOpen();
      return tile;
    });
  }
}

export default TileGroup;
