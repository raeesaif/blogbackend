import multer from "multer";

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, and PNG images are allowed"), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB in bytes
  }
});

const handleUploadError = (req, res, next) => {
  upload.single("coverImage")(req, res, (err) => {
    if (err) {
      if (err.message === "Only JPG, JPEG, and PNG images are allowed") {
        return res.status(400).json({ 
          success: false, 
          errors: [{ field: "coverImage", message: "Only JPG, JPEG, and PNG images are allowed" }]
        });
      }
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ 
          success: false, 
          errors: [{ field: "coverImage", message: "Image size must be less than 5MB" }]
        });
      }
      return res.status(400).json({ 
        success: false, 
        errors: [{ field: "coverImage", message: err.message }]
      });
    }
    next();
  });
};

export { handleUploadError };
export default upload;