import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { User } from "../user/user.model";
import { IJoinODRP } from "./joinODRP.interface";
import { JoinODRPModel } from "./joinODRP.model";

const joinODRP = async (
  payload: IJoinODRP,
  email: string,
  files: Express.Multer.File[],
  titles: string | string[]
) => {
  const {
    firstName,
    lastName,
    email: inputEmail,
    phone,
    address,
    city,
    postalCode,
    dateOfBirth,
    gender,
    country,
    organizationName,
    workExperience,
    professionType,
  } = payload;

  const user = await User.isUserExistByEmail(email);
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  const normalizedTitles = Array.isArray(titles)
    ? titles
    : titles.split(",").map((t) => t.trim());

  const documents: IJoinODRP["documents"] = [];

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const title = normalizedTitles[i] || normalizedTitles[0];

      const upload = await uploadToCloudinary(file.path, "odrp-documents");

      documents.push({
        title,
        url: upload.secure_url,
        public_id: upload.public_id,
      });
    }
  } else {
    throw new AppError("No files uploaded", StatusCodes.BAD_REQUEST);
  }

  const joinData = await JoinODRPModel.create({
    userId: user._id,
    organizationName,
    workExperience,
    professionType,
    documents,
    status: "pending",
  });

  await User.findByIdAndUpdate(
    user._id,
    {
      firstName,
      lastName,
      email: inputEmail,
      phone,
      address,
      city,
      postalCode,
      dateOfBirth,
      gender,
      country,
    },
    { new: true, runValidators: true }
  );

  return joinData;
};

const getAllODRPDocuments = async (filters: any) => {
  const { page, limit, search, status, sort } = filters;
  const query: any = {};

  if (search) {
    query.$or = [
      { "userId.firstName": { $regex: search, $options: "i" } },
      { "userId.lastName": { $regex: search, $options: "i" } },
    ];
  }

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    query.status = status;
  }

  const now = new Date();
  if (sort === "last-7-days") {
    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 7);
    query.createdAt = { $gte: last7Days };
  } else if (sort === "monthly") {
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    query.createdAt = { $gte: firstOfMonth };
  }

  const skip = (page - 1) * limit;

  const documents = await JoinODRPModel.find(query)
    .populate("userId", "firstName lastName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await JoinODRPModel.countDocuments(query);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: documents,
  };
};

const getAllVerifiedODRPDocuments = async (filters: any) => {
  const { page, limit, search, city } = filters;
  const query: any = { isVerified: true, status: "approved" };

  if (search) {
    query.$or = [
      { "userId.firstName": { $regex: search, $options: "i" } },
      { "userId.lastName": { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  let documents = await JoinODRPModel.find(query)
    .populate("userId", "firstName lastName email country city")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if (city) {
    documents = documents.filter(
      (doc: any) =>
        doc.userId?.city &&
        doc.userId.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  const total = documents.length;

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: documents,
  };
};

export const JoinODRPService = {
  joinODRP,
  getAllODRPDocuments,
  getAllVerifiedODRPDocuments,
};
