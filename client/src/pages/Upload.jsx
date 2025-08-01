import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'

const Upload = () => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file && file.type === 'text/csv') {
      setUploadedFile(file)
    } else {
      alert('Please upload a CSV file')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  })

  const handleProcess = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    // TODO: Implement CSV processing
    setTimeout(() => {
      setIsProcessing(false)
      alert('CSV processing will be implemented soon!')
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload CSV File</h1>
        <p className="text-gray-600">
          Upload a CSV file to generate Instagram carousel posts with Islamic themes
        </p>
      </div>

      {/* CSV Format Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Expected CSV Format</h3>
        <div className="bg-white rounded border p-4 text-sm font-mono">
          <div className="text-gray-600 mb-2">Required columns:</div>
          <div className="text-blue-600">
            post_title, theme, scheduled_for, font, page_1_content, page_2_content, ...
          </div>
        </div>
        <div className="mt-4 text-sm text-blue-800">
          <p><strong>Themes:</strong> theme1, theme2, theme3, theme4, theme5</p>
          <p><strong>Date Format:</strong> ISO 8601 (YYYY-MM-DDTHH:MM:SS)</p>
          <p><strong>Font:</strong> Font name/slug or "default"</p>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : uploadedFile
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          
          {uploadedFile ? (
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                File Ready to Process
              </h3>
              <p className="text-green-700 mb-2">{uploadedFile.name}</p>
              <p className="text-sm text-green-600">
                Size: {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📁</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isDragActive ? 'Drop the CSV file here' : 'Drag & drop CSV file here'}
              </h3>
              <p className="text-gray-600">
                Or click to select a CSV file from your computer
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {uploadedFile && (
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => setUploadedFile(null)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Remove File
            </button>
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Process CSV & Generate Posts</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Upload