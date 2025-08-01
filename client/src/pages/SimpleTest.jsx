import React from 'react'

const SimpleTest = () => {
  return (
    <div style={{padding: '20px'}}>
      <h1 style={{color: 'blue', marginBottom: '20px'}}>Basic HTML Test</h1>
      
      <div className="bg-red-500 text-white p-4 rounded">
        If this has a red background, Tailwind is working!
      </div>
      
      <div className="mt-4 bg-green-500 text-white p-4 rounded">
        If this has a green background, Tailwind is working!
      </div>

      <div className="mt-4 islamic-gold p-4 border">
        Islamic Gold Text Test
      </div>

      <div className="mt-4 bg-islamic-blue text-white p-4 rounded">
        Islamic Blue Background Test
      </div>
    </div>
  )
}

export default SimpleTest