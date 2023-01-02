import TileStateEnum from "./enums/TileStateEnum";

/** A truthy or falsy value, meant to be numeric (1 | 0) or boolean (true | false) */
// type TruthyOrFalsy = number | boolean

/** Each single tile of the nonogram puzzle */
class Tile {
   /** Horizontal position of the tile */
  private _x: number = 0;
   /** Vertical position of the time */
  private _y: number = 0;
   /** Whether or not the tile is filled */
  private _filled: boolean = false;
   /** Whether or not the tile is opened */
  private _state: TileStateEnum = TileStateEnum.CLOSED;
   /** Whether or not the tile is flagged */
  private _flagged: boolean = false;

  /**
    * Creates a new `Tile` instance
    * @param value Truthy/falsy value indicating whether or not the tile is filled
    * @param x Horizontal position of the tile
    * @param y Vertical position of the time
    */
  constructor(value: number | boolean, x: number, y: number) {
    this._x = x;
    this._y = y;
    this._filled = value ? true : false;
  }

   /** Horizontal position of the tile */
  get x(): number {
    return this._x;
  }

   /** Vertical position of the time */
  get y(): number {
    return this._y;
  }

   /** Whether or not the tile is filled */
  get filled(): boolean {
    return this._filled;
  }

   /** Whether or not the tile is opened */
  get state(): TileStateEnum {
    return this._state;
  }

   /** Whether or not the tile is flagged */
  get flagged(): boolean {
    return this._flagged;
  }

  /** Toggles whther or not a tile is opened */
  toggleOpen(): void {
    if (!this._flagged) {
      // If the space is not filled, flag it and mark it as wrong
      if (!this._filled) {
        this.toggleFlag();
        this._state = TileStateEnum.WRONG;
        return;
      }

      // Otherwise, toggle it open/close
      this._state =
        this._state === TileStateEnum.CLOSED
          ? TileStateEnum.OPEN
          : TileStateEnum.CLOSED;
    }

    if (this._state === TileStateEnum.WRONG) return;
  }

  /** Toggles whther or not a tile is flagged */
  toggleFlag(): void {
    if (this._state === TileStateEnum.CLOSED) this._flagged = !this._flagged;
  }
}

export default Tile;
