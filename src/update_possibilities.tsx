"use client";
import { initPossibilities} from "./group-grid";

export function update_possibilities(grid: string[][], _setPossibilities: (arg0: Set<string>[][]) => void, gridSize: number) {
  const newPossibilities = initPossibilities(gridSize);
  // if a*b = a*c => b = c. Therefore, all columns and all rows cannot repeat elements
  // Ensure no repeats in rows and columns
  // row
  for (let i = 0; i < gridSize; i++) {
    const rowValues = new Set<string>();
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] !== '') rowValues.add(grid[i][j]);
    }
    for (let j = 0; j < gridSize; j++) {
      for (let el of rowValues) {
        newPossibilities[i][j].delete(el);
      }
    }
  }
  // column
  for (let j = 0; j < gridSize; j++) {
    const columnVals = new Set<string>();
    for (let i = 0; i < gridSize; i++) {
      if (grid[i][j] !== '') columnVals.add(grid[i][j]);
    }
    for (let i = 0; i < gridSize; i++) {
      for (let el of columnVals) {
        newPossibilities[i][j].delete(el);
      }
    }
  }


  // every element has an inverse. Therefore, all columns and all rows must contain a single mention of 'e'. Also, this should be simetric
  // Ensure 'e' appears once in each row and column, and maintain symmetry
  // This is already garanteed in all columns rows cant repeat. However we need to check symmetry
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === 'e') {
        if(newPossibilities[j][i].size === 0)
          newPossibilities[j][i] = new Set(['e'])
        for (let k = 0; k < gridSize; k++) {
          if (k !== j) newPossibilities[k][i].delete('e')
          if (k !== i) newPossibilities[j][k].delete('e')
        }
      }
    }
  }


  // transitive property. (a*b)*c = a*(b*c) . So, for every filled cell (a*b), we should check at its result column, and guarantee that 
  // each cell there at row X will not contradict a*(b*X)
  // Apply transitive property
  /*
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] !== '') {
        const a = LETTERS.indexOf(grid[i][0]);
        const b = LETTERS.indexOf(grid[0][j]);
        const result = LETTERS.indexOf(grid[i][j]);
        for (let k = 1; k < gridSize; k++) {
          if (k !== j) {
            const c = LETTERS.indexOf(grid[0][k]);
            const expected = LETTERS[(result + gridSize - c) % gridSize];
            newPossibilities[i][k] = newPossibilities[i][k].filter(val => val === expected);
          }
        }
      }
    }
  }
  */

  // If a grid cell is filled, collapse possibilities there to grid content
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] !== '') {
        newPossibilities[i][j] = new Set(grid[i][j]);
      }
    }
  }
  _setPossibilities(newPossibilities);
}
