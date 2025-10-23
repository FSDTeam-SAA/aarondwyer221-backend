import { ObjectId } from "mongoose";

export interface IJoinODRP {
  userId: ObjectId;
  organizationName?: string;
  workExperience?: number;
  professionType: string;
  documents: {
    title: string;
    url: string;
  }[];
  status: string;
}
