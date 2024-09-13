export default function InfoPanel({ selectedLetter }: { selectedLetter: string | null }){
  return (
    <div className="w-64 bg-blue-950 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Info Panel</h2>
      {selectedLetter ? (
        <div>
          <p className="mb-2">Selected letter: <span className="font-bold">{selectedLetter}</span></p>
          <p>Add more information about the letter here...</p>
        </div>
      ) : (
        <p>Select a letter to see more information.</p>
      )}
    </div>
  )
}