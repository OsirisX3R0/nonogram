import Tile from "./tile"

type Group = {
  count: number,
  tiles: Tile[]
}

class TileGroup {
  private #count: number
  private #tiles: Tile[]

  constructor(group: Group)

  count: () => number
  tiles: () => Tile[]
}