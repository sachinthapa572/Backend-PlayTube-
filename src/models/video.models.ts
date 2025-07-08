import mongoose, { Document, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

interface IVideo extends Document {
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: mongoose.Schema.Types.ObjectId;
}

const videoSchema = new mongoose.Schema<IVideo>(
  {
    videoFile: {
      type: String, // Cloudinary URL
      required: true,
    },
    thumbnail: {
      type: String, // Cloudinary URL
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

videoSchema.plugin(aggregatePaginate);

export const Video = mongoose.model<IVideo>('Video', videoSchema);
