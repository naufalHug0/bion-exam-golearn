import multer from 'multer'
import path from 'path'
import fs from 'fs'


const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }
}


const storage = (folderName) => multer.diskStorage({
    destination(req, file, cb) {
        const uploadPath = `uploads/${folderName}`
        ensureDir(uploadPath)
        cb(null, uploadPath)
    },
    filename(req, file, cb) {
        
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`)
    }
})




const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    }
    cb(new Error('Only images (jpg, jpeg, png, webp) are allowed!'))
}


const materialFilter = (req, file, cb) => {
    
    const allowedTypes = /pdf|ppt|pptx|mp4|mkv|avi|webm/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    
    if (extname) {
        return cb(null, true)
    }
    cb(new Error('Only PDF, PPT, PPTX, and Video (mp4, mkv, avi, webm) files are allowed!'))
}



export const uploadSubject = multer({
    storage: storage('subjects'),
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
})

export const uploadUser = multer({
    storage: storage('users'),
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
})

export const uploadMaterial = multer({
    storage: storage('materials'),
    fileFilter: materialFilter,
    limits: { fileSize: 500 * 1024 * 1024 } 
})