import multer from 'multer';
import path from 'path';

const storage= multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/productImages/');
    },

    filename: function(req,file,cb) {
        const productName = req.body.name
      ? req.body.name.replace(/\s+/g, "_").toLowerCase()
      : "product";

        const ext = path.extname(file.originalname);

        const filename = `${productName}_${Date.now()}${ext}`;
        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

export const upload = multer({ storage, fileFilter });