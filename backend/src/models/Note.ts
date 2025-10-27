import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  className: string;
  classNumber: string;
  instructorName?: string;
  quarter: string;
  ownerId: mongoose.Types.ObjectId;
  s3Bucket: string;
  s3Key: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  title: { type: String, required: true, trim: true },
  className: { type: String, required: true, trim: true, index: true },
  classNumber: { type: String, required: true, trim: true },
  instructorName: { type: String, trim: true },
  quarter: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  s3Bucket: { type: String, required: true },
  s3Key: { type: String, required: true, unique: true },
  fileSize: { type: Number, required: true }
}, {
  timestamps: true // Auto-generates createdAt and updatedAt
});

export default mongoose.model<INote>('Note', NoteSchema);
