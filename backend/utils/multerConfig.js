import multer from 'multer';

// Setup multer for file upload (in memory storage)
const storage = multer.memoryStorage();
 const upload = multer({ storage });
 export default upload;