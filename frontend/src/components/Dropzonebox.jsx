'use client'

import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaUpload } from 'react-icons/fa'

export default function DropzoneBox() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
      setIsAnalyzing(true)
      setResult(null)
    }
  }, [])

  useEffect(() => {
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('file', selectedFile)

    fetch('http://localhost:5001/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setIsAnalyzing(false)
          setResult(data)
        }, 1500)
      })
      .catch((err) => {
        console.error('Upload error:', err)
        setIsAnalyzing(false)
      })
  }, [selectedFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: false,
  })

  return (
    <div className="w-full max-w-2xl flex flex-col items-center justify-center px-4">
      {!selectedFile && (
        <div
          {...getRootProps()}
          className={`w-full p-10 border-4 border-dashed rounded-3xl transition-all duration-300 cursor-pointer ${
            isDragActive ? 'border-blue-600 bg-blue-100' : 'border-gray-400 bg-white'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <FaUpload className="w-14 h-14 text-blue-600" />
            <p className="text-gray-800 font-semibold text-lg text-center">
              {isDragActive ? 'Drop your resume here...' : 'Drag & drop your resume or click to upload'}
            </p>
            <p className="text-sm text-gray-600 text-center">
              Accepted formats: .pdf, .docx, .jpg, .jpeg, .png
            </p>
          </div>
        </div>
      )}

      {selectedFile && isAnalyzing && (
        <div className="mt-10 flex flex-col items-center justify-center">
          <div className="w-24 h-24 border-8 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
          <p className="mt-6 text-2xl font-bold text-blue-800">
            Analyzing your resume...
          </p>
        </div>
      )}

      {result && (
        <div className="mt-10 w-full bg-white border-2 border-green-500 rounded-2xl p-6 shadow-lg">
          <h2 className="text-3xl font-extrabold text-green-700 mb-4">
            ✅ ATS Score: {result.atsScore}/100
          </h2>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">📌 Suggestions:</h3>
          <ul className="list-disc pl-6 text-gray-800 text-base mb-6 space-y-2">
            {result.suggestions.map((suggestion, idx) => (
              <li key={idx}>{suggestion}</li>
            ))}
          </ul>

          {result.missingKeywords?.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🧩 Missing Keywords:</h3>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((word, idx) => (
                  <span
                    key={idx}
                    className="bg-red-200 text-red-900 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
