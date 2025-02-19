declare namespace Express {
    interface Request {
      file?: Express.Multer.File;  // Adding the 'file' property
    }
  }
  