import { model, Schema } from "mongoose";
import { IJoinODRP } from "./joinODRP.interface";

const joinODRPSchema = new Schema<IJoinODRP>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    organizationName: {
      type: String,
    },
    workExperience: {
      type: Number,
    },
    professionType: {
      type: String,
      required: true,
    },
    documents: [
      {
        title: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        _id: false,
      },
    ],
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const JoinODRPModel = model<IJoinODRP>("JoinODRP", joinODRPSchema);
