const express = require('express')
const multer = require('multer')
const fs = require('fs')
const pdfParse = require('pdf-parse')
const mammoth = require('mammoth')
const cors = require('cors')
const path = require('path')

const app = express()
const port = 5001

app.use(cors())

// Setup file upload
const upload = multer({ dest: 'uploads/' })

// POST endpoint to upload and analyze resume
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file
  if (!file) return res.status(400).json({ error: 'No file uploaded' })

  let resumeText = ''

  try {
    if (file.mimetype === 'application/pdf') {
      const buffer = fs.readFileSync(file.path)
      const data = await pdfParse(buffer)
      resumeText = data.text
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const buffer = fs.readFileSync(file.path)
      const result = await mammoth.extractRawText({ buffer })
      resumeText = result.value
    } else {
      return res.status(400).json({ error: 'Unsupported file type' })
    }

    // Clean up uploaded file
    fs.unlinkSync(file.path)

    // === ATS Score Logic ===
    const keywords = ['JavaScript', 'React', 'HTML', 'CSS', 'Next.js']
    let score = 0
    let missing = []

    keywords.forEach((word) => {
      if (resumeText.toLowerCase().includes(word.toLowerCase())) {
        score += 10
      } else {
        missing.push(word)
      }
    })

    if (resumeText.includes('@')) score += 5
    if (resumeText.toLowerCase().includes('linkedin')) score += 5

    const suggestions = [
      ...missing.map((kw) => `Consider adding "${kw}" to your resume.`),
      ...(resumeText.includes('@') ? [] : ['Include your email address.']),
      ...(resumeText.toLowerCase().includes('linkedin') ? [] : ['Include your LinkedIn profile.']),
    ]

    res.json({
      atsScore: Math.min(score, 100),
      missingKeywords: missing,
      suggestions,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to process resume' })
  }
})

app.listen(port, () => {
  console.log(`✅ Resume Analyzer backend running at http://localhost:${port}`)
})
