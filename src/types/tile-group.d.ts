import Tile from "./tile"

class TileGroup {
  private #count: number
  private #tiles: Tile[]

  count: () => number
  tiles: () => Tile[]

  addTile(tile: Tile): void
}