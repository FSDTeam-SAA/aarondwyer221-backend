import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JoinODRPService } from "./joinODRP.service";

const joinODRPController = catchAsync(async (req, res) => {
  const { email } = req.user;
  const files = req.files as Express.Multer.File[];
  const { titles } = req.body;

  const result = await JoinODRPService.joinODRP(req.body, email, files, titles);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Join ODRP request submitted successfully",
    data: result,
  });
});

const getAllODRPDocuments = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    sort = "all",
  } = req.query;

  const result = await JoinODRPService.getAllODRPDocuments({
    page: Number(page),
    limit: Number(limit),
    search: search.toString(),
    status: status.toString(),
    sort: sort.toString(),
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Documents fetched successfully",
    data: result,
  });
});

const getAllVerifiedODRPDocuments = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, search = "", city = "" } = req.query;

  const result = await JoinODRPService.getAllVerifiedODRPDocuments({
    page: Number(page),
    limit: Number(limit),
    search: search.toString(),
    city: city.toString(),
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Documents fetched successfully",
    data: result,
  });
});

export const JoinODRPController = {
  joinODRPController,
  getAllODRPDocuments,
  getAllVerifiedODRPDocuments,
};
