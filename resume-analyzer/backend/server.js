const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5001;


const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage: storage });


app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded!" });

        const filePath = req.file.path;
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        let extractedText = "";

        if (fileExt === ".pdf") {
            const data = await pdfParse(fs.readFileSync(filePath));
            extractedText = data.text;
        } else if (fileExt === ".docx") {
            const { value } = await mammoth.extractRawText({ path: filePath });
            extractedText = value;
        } else if (fileExt === ".txt") {
            extractedText = fs.readFileSync(filePath, "utf-8");
        } else {
            return res.status(400).json({ error: "Unsupported file type!" });
        }


        fs.unlinkSync(filePath);

        res.json({ message: "File processed successfully!", text: extractedText });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Failed to process file" });
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
