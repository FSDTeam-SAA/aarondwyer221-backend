import { ObjectId } from "mongoose";

export interface IJoinODRP {
  userId: ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: "male" | "female";
  email: string;
  phone?: string;
  country?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  organizationName?: string;
  workExperience?: number;
  professionType: string;
  documents: {
    title: string;
    public_id: string;
    url: string;
  }[];
  status: string;
}
