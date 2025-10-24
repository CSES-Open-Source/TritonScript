import { Request, Response, NextFunction } from 'express';

// check if email is valid UCSD email check later
// NOTE: WE NEED TO ADD SSO HERE LATER FOR FULL VERIFICATION
export const validateUCSDEmail = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const { ucsdEmail } = req.body;
  console.log("Validating email: "+ucsdEmail)

  if (!ucsdEmail) {
    res.status(400).json({
      success: false,
      message: 'UCSD email is required'
    });
    return;
  }

  // Check domain
  if (!ucsdEmail.toLowerCase().endsWith('@ucsd.edu')) {
    res.status(400).json({
      success: false,
      message: 'Only UCSD students can register. Use your @ucsd.edu email.'
    });
    return;
  }

  next();
  console.log("UCSD email validated successfully, going next...")
};

