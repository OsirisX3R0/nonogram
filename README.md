# Nonogram Maker

```js
import { Board } from "nonogram-maker";

// Creates a 6x6 board with 5 lives to start
let board = new Board(
  [
    [0, 0, 1, 1, 0, 0],
    [0, 1, 0, 0, 1, 0],
    [1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 1, 0],
    [0, 0, 1, 1, 0, 0],
  ],
  { lives: 5 }
);
```
