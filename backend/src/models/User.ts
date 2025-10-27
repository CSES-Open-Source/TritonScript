import mongoose, {Document, Schema, Model} from "mongoose";
import bcrypt from "bcrypt";


// properties for User model
export interface IUser {
    ucsdEmail: string;
    firstName: string;
    lastName: string;
    password: string;
    profilePicture?: string;
    refreshToken?: string;      
    loginAttempts: number;       
    lockUntil?: Date;           
    createdAt?: Date;
}

export interface IUserDocument extends IUser, Document {
    _id: mongoose.Types.ObjectId;
    comparePassword(candidatePassword: string): Promise<boolean>;
    incrementLoginAttempts(): Promise<void>;
    resetLoginAttempts(): Promise<void>;
    isLocked(): boolean;
}

export interface IUserModel extends Model<IUserDocument> {}

// Create user schema
const UserSchema = new Schema<IUserDocument>({
    ucsdEmail: {
        type: String,
        required: [true, 'UCSD email is required'],
        unique: true,              // Can't have duplicate emails
        lowercase: true,           // Store as lowercase
        validate: {
          validator: function(email: string) {
            // THIS IS THE ONLY PLACE WE CHECK UCSD EMAIL
            return email.endsWith('@ucsd.edu');
          },
          message: 'Email must be a valid @ucsd.edu address'
        }
      },
      firstName: {
        type: String,
        require: [true, 'First name is required'],
        trim: true
      },
      lastName: {
        type: String,
        require: [true, 'Last name is required'],
        trim: true
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false              // Exclude password from query results by default
      },
      profilePicture: {
        type: String,
        default: ''                // Default to empty string if not provided
      },
        refreshToken: {
        type: String,
        select: false              // Exclude refresh token from query results by default
      },
        loginAttempts: {
            type: Number,
            default: 0
        },
        lockUntil: {
            type: Date
        },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

// Hash password before saving to database
UserSchema.pre('save', async function(next) {
    // Only hash if password was modified (not on every save)
    if (!this.isModified('password')) return next();
    
    try {
      // Salt rounds = 10 is standard (higher = more secure but slower)
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error: any) {
      next(error);
    }
  });

  UserSchema.methods.comparePassword = async function(
    candidatePassword: string
  ): Promise<boolean> {
    try {
      console.log('This password', this.password);
      console.log('Candidate password', candidatePassword);
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      return false;
    }
  };


  UserSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
    // If lock expired, reset attempts
    if (this.lockUntil && this.lockUntil < new Date()) {
      await this.updateOne({
        $set: { loginAttempts: 1 },
        $unset: { lockUntil: 1 }
      });
      return;
    }
    
    const updates: any = { $inc: { loginAttempts: 1 } };
    
    // Lock account after max attempts
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked()) {
      updates.$set = { lockUntil: new Date(Date.now() + LOCK_TIME) };
    }
    
    await this.updateOne(updates);
  };

  UserSchema.methods.resetLoginAttempts = async function(): Promise<void> {
    await this.updateOne({
      $set: { loginAttempts: 0 },
      $unset: { lockUntil: 1 }
    });
  };

  UserSchema.methods.isLocked = function(): boolean {
    return !!(this.lockUntil && this.lockUntil > new Date());
  };

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);
export default User;

