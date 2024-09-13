"use client"

import { useState, useEffect } from 'react'
import { Button } from './button'
import React from 'react'
import InfoPanel from './InfoPanel'  // Add this import

const GRID_SIZE = 4
const LETTERS = 'eabcdfghijklmnopqrstuvxz'.slice(0, GRID_SIZE)

function Cell({ value, onClick, isSelected }: { value: string; onClick: () => void; isSelected: boolean }) {
  return (
    <div
      className={`w-10 h-10 border border-gray-300 flex items-center justify-center text-xl font-bold cursor-pointer ${
        isSelected ? 'bg-gray-400' : 'bg-gray'
      }`}
      onClick={onClick}
    >
      {value}
    </div>
  );
}

function Ruler({ onLetterClick, onClear }: { onLetterClick: (letter: string) => void; onClear: () => void }) {
  return (
    <div className="flex space-x-2 mt-4">
      {LETTERS.split('').map((letter) => (
        <Button key={letter} onClick={() => onLetterClick(letter)} variant="outline" className="w-10 h-10 p-0">
          {letter}
        </Button>
      ))}
      <Button onClick={onClear} variant="destructive" className="px-2">
        Clear
      </Button>
    </div>
  );
}

export default function GroupGrid() {
  const [grid, setGrid] = useState<string[][]>(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('')))
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell([row, col])
  }

  const handleLetterClick = (letter: string) => {
    if (selectedCell) {
      const [row, col] = selectedCell
      const newGrid = [...grid]
      newGrid[row][col] = letter
      setGrid(newGrid)
    }
  }

  const handleClear = () => {
    if (selectedCell) {
      const [row, col] = selectedCell
      const newGrid = [...grid]
      newGrid[row][col] = ''
      setGrid(newGrid)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedCell) {
        const [row, col] = selectedCell
        if (LETTERS.includes(e.key)) {
          const newGrid = [...grid]
          newGrid[row][col] = e.key
          setGrid(newGrid)
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          const newGrid = [...grid]
          newGrid[row][col] = ''
          setGrid(newGrid)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCell, grid])

  const GridRow = ({ row, rowIndex }: { row: string[], rowIndex: number }) => (
    <React.Fragment key={`row-${rowIndex}`}>
      <LeftHeaderCell index={rowIndex} />
      {row.map((cell, colIndex) => (
        <Cell
          key={`${rowIndex}-${colIndex}`}
          value={cell}
          onClick={() => handleCellClick(rowIndex, colIndex)}
          isSelected={selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex}
        />
      ))}
    </React.Fragment>
  );

  return (
    <div className="flex items-start space-x-8">
      <div className="flex flex-col items-center space-y-4">
        <GridContainer>
          <HeaderRow />
          {grid.map((row, rowIndex) => (
            <GridRow key={`row-${rowIndex}`} row={row} rowIndex={rowIndex} />
          ))}
        </GridContainer>
        <Ruler onLetterClick={handleLetterClick} onClear={handleClear} />
      </div>
      <InfoPanel selectedCell={selectedCell} />
    </div>
  )
}

const HeaderRow = () => (
  <div className="col-start-2 col-span-full flex">
    {Array(GRID_SIZE).fill(null).map((_, index) => (
      <div key={`header-${index}`} className="flex-1 text-center font-bold">
        {LETTERS[index]}
      </div>
    ))}
  </div>
);

const LeftHeaderCell = ({ index }: { index: number }) => (
  <div className="font-bold text-center flex items-center justify-center">
        {LETTERS[index]}
  </div>
);


const GridContainer = ({ children }: { children: React.ReactNode }) => (
  <div 
    className={`grid gap-0.5 border-2 border-gray-800`} 
    style={{ gridTemplateColumns: `repeat(${GRID_SIZE + 1}, minmax(0, 1fr))` }}
  >
    {children}
  </div>
);