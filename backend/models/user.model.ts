import mongoose from "mongoose";

export enum UserRole {
  STUDENT = 'student',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  UCSD_SSO = 'ucsd_sso'
}

// Interface for User document including virtual properties
export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password?: string;
  profilePicture: string;
  role: UserRole;
  authProvider: AuthProvider;
  isVerified: boolean;
  isUcsdStudent: boolean;
  ucsdPid?: string;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  refreshTokens: Array<{
    token: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual properties
  isLocked: boolean;
  
  // Methods
  incLoginAttempts(): Promise<any>;
  resetLoginAttempts(): Promise<any>;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function() {
        return this.authProvider === AuthProvider.LOCAL;
      },
      minlength: 8,
    },
    profilePicture: {
      type: String,
      default: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STUDENT,
    },
    authProvider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.LOCAL,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isUcsdStudent: {
      type: Boolean,
      default: false,
    },
    ucsdPid: {
      type: String,
      sparse: true, // Allows null values but ensures uniqueness when present
    },
    lastLogin: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    refreshTokens: [{
      token: String,
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800 // 7 days in seconds
      }
    }],
  },
  { timestamps: true }
);

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to determine UCSD student status
userSchema.pre('save', function(next) {
  if (this.email && this.email.endsWith('@ucsd.edu')) {
    this.isUcsdStudent = true;
    this.isVerified = true; // Auto-verify UCSD emails
  }
  next();
});

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates: any = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
