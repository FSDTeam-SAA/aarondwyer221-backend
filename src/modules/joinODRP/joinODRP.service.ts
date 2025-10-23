import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary";
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
//   let oldImagePublicId: string | undefined;

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const title = normalizedTitles[i] || normalizedTitles[0];

      const upload = await uploadToCloudinary(file.path, "odrp-documents");
    //   oldImagePublicId = upload.public_id;

      documents.push({
        title,
        url: upload.secure_url,
        public_id: upload.public_id,
      });
    }
  } else {
    throw new AppError("No files uploaded", StatusCodes.BAD_REQUEST);
  }

//   if(files && oldImagePublicId) {
//     await deleteFromCloudinary(oldImagePublicId);
//   }


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

export const JoinODRPService = {
  joinODRP,
};
