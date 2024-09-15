"use client"

import { useState, useEffect } from 'react'
import { Button } from './button'
import React from 'react'
import InfoPanel, { toast } from './InfoPanel'  // Add this import
import { update_possibilities } from './update_possibilities'

export const LETTERS = 'eabcdfghijklmnopqrstuvxz'

export default function GroupGrid() {
  const [gridSize, setGridSize] = useState(4)
  const [possibilities, _setPossibilities] = useState(() => initPossibilities(gridSize))
  const [grid, _setGrid] = useState(() => makeGridFromPossibilities(possibilities))
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)

  function set_cell(row: number, col: number, value: string) {
    if (value === '' || possibilities[row][col].has(value)) {
      const newGrid = [...grid]
      newGrid[row][col] = value
      _setGrid(newGrid)
      update_possibilities(grid, _setPossibilities, gridSize)
    } else {
      toast(`Invalid move: ${value} is not possible for this cell`)
    }
  }

  useEffect(() => {
      update_possibilities(grid, _setPossibilities, gridSize)
  }, [])

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell([row, col])
  }

  const handleLetterClick = (letter: string) => {
    if (selectedCell) {
      const [row, col] = selectedCell
      set_cell(row, col, letter)
    }
  }

  const handleClear = () => {
    if (selectedCell) {
      const [row, col] = selectedCell
      set_cell(row, col, '')
    }
  }

  const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value)
    if (newSize >= 2 && newSize <= LETTERS.length) {
      setGridSize(newSize)
      let grid = makeGridFromPossibilities(initPossibilities(newSize))
      _setGrid(grid)
      update_possibilities(grid, _setPossibilities, newSize)
      setSelectedCell(null)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedCell) {
        const [row, col] = selectedCell
        if (LETTERS.slice(0, gridSize).includes(e.key)) {
          set_cell(row, col, e.key)
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          set_cell(row, col, '')
        } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault()
          let newRow = row
          let newCol = col
          switch (e.key) {
            case 'ArrowUp':
              newRow = Math.max(0, row - 1)
              break
            case 'ArrowDown':
              newRow = Math.min(gridSize - 1, row + 1)
              break
            case 'ArrowLeft':
              newCol = Math.max(0, col - 1)
              break
            case 'ArrowRight':
              newCol = Math.min(gridSize - 1, col + 1)
              break
          }
          setSelectedCell([newRow, newCol])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCell, grid, gridSize])

  const GridRow = ({ row, rowIndex }: { row: string[], rowIndex: number }) => (
    <React.Fragment key={`row-${rowIndex}`}>
      <LeftHeaderCell index={rowIndex} gridSize={gridSize} />
      {row.map((cell, colIndex) => (
        <Cell
          key={`${rowIndex}-${colIndex}`}
          value={cell}
          potential_values={possibilities[rowIndex][colIndex]}
          onClick={() => handleCellClick(rowIndex, colIndex)}
          isSelected={selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex}
        />
      ))}
    </React.Fragment>
  );

  return (
    <div className="app-container">
      <div className="group-grid flex items-start space-x-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="mb-4">
            <label htmlFor="gridSize" className="mr-2">Grid Size:</label>
            <input
              type="number"
              id="gridSize"
              min="2"
              max={LETTERS.length}
              value={gridSize}
              onChange={handleGridSizeChange}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <GridContainer gridSize={gridSize}>
            <HeaderRow gridSize={gridSize} />
            {grid.map((row, rowIndex) => (
              <GridRow key={`row-${rowIndex}`} row={row} rowIndex={rowIndex} />
            ))}
          </GridContainer>
          <Ruler onLetterClick={handleLetterClick} onClear={handleClear} gridSize={gridSize} />
        </div>
        <InfoPanel />
      </div>
    </div>
  )
}

const HeaderRow = ({ gridSize }: { gridSize: number }) => (
  <div className="col-start-2 col-span-full flex">
    {Array(gridSize).fill(null).map((_, index) => (
      <div key={`header-${index}`} className="flex-1 text-center font-bold">
        {LETTERS[index]}
      </div>
    ))}
  </div>
);

const LeftHeaderCell = ({ index, gridSize }: { index: number; gridSize: number }) => (
  <div className="font-bold text-center flex items-center justify-center">
    {LETTERS.slice(0, gridSize)[index]}
  </div>
);

const GridContainer = ({ children, gridSize }: { children: React.ReactNode; gridSize: number }) => (
  <div 
    className={`grid gap-0.5 border-2 border-gray-800`} 
    style={{ gridTemplateColumns: `repeat(${gridSize + 1}, minmax(0, 1fr))` }}
  >
    {children}
  </div>
);

export function initPossibilities(gridSize: number) : Array<Array<Set<string>>>
{
  let out = Array(gridSize).fill(null).map(() =>
    Array(gridSize).fill(null).map(() =>
      new Set(LETTERS.slice(0, gridSize))))
  for (let i=0; i< gridSize; i++) {
    out[0][i] = new Set([LETTERS[i]])
    out[i][0] = new Set([LETTERS[i]])
  }
  return out
}

function makeGridFromPossibilities(possibilites: ReturnType<typeof initPossibilities>) : string[][] {
  return possibilites.map(row => 
    row.map(cell => 
      cell.size === 1 ? Array.from(cell)[0] : ''
    )
  )
}

function Cell({ value, potential_values, onClick, isSelected }: { value: string; potential_values: Set<string>, onClick: () => void; isSelected: boolean }) {
  return (
    <div
      className={`w-16 h-16 border border-gray-300 flex items-center justify-center text-2xl font-bold cursor-pointer ${
        isSelected ? 'bg-gray-400' : 'bg-gray'
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full w-full">
        <div className="flex-grow flex items-center justify-center" style={{ minHeight: '70%' }}>
          {value}
        </div>
        <div className="text-sm opacity-50 flex items-center justify-center" style={{ minHeight: '30%' }}>
          {Array.from(potential_values).join('')}
        </div>
      </div>
    </div>
  );
}

function Ruler({ onLetterClick, onClear, gridSize }: { onLetterClick: (letter: string) => void; onClear: () => void; gridSize: number }) {
  return (
    <div className="flex space-x-2 mt-4">
      {LETTERS.slice(0, gridSize).split('').map((letter) => (
        <Button key={letter} onClick={() => onLetterClick(letter)} variant="outline" className="w-16 h-16 p-0 text-xl">
          {letter}
        </Button>
      ))}
      <Button onClick={onClear} variant="destructive" className="px-4 text-xl">
        Clear
      </Button>
    </div>
  );
}