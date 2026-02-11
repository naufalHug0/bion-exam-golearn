import multer from 'multer'
import path from 'path'
import fs from 'fs'

// --- 1. Utility: Ensure Directory Exists ---
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }
}

// --- 2. Configuration: Storage Strategy ---
const storage = (folderName) => multer.diskStorage({
    destination(req, file, cb) {
        const uploadPath = `uploads/${folderName}`
        ensureDir(uploadPath)
        cb(null, uploadPath)
    },
    filename(req, file, cb) {
        // Unique filename: fieldname-timestamp-random.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
    }
})

// --- 3. Configuration: File Filters ---

// Filter Gambar (Thumbnail/Avatar)
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    }
    cb(new Error('Only images (jpg, jpeg, png, webp) are allowed!'))
}

// Filter Material (PDF, PPT, VIDEO FISIK)
const materialFilter = (req, file, cb) => {
    // Menambahkan 'webm' dan memastikan video extensions tercover
    const allowedTypes = /pdf|ppt|pptx|mp4|mkv|avi|webm/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    
    if (extname) {
        return cb(null, true)
    }
    cb(new Error('Only PDF, PPT, PPTX, and Video (mp4, mkv, avi, webm) files are allowed!'))
}

// --- 4. Exports ---

export const uploadSubject = multer({
    storage: storage('subjects'),
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB (untuk thumbnail high-res)
})

export const uploadUser = multer({
    storage: storage('users'),
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})

export const uploadMaterial = multer({
    storage: storage('materials'),
    fileFilter: materialFilter,
    limits: { fileSize: 500 * 1024 * 1024 } // 500MB (Support Video Upload Besar)
})