import { Mongoose, Schema } from "mongoose";
const subscriptionSchema = new Mongoose.Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = Mongoose.model("Subscription", subscriptionSchema);
