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

export const JoinODRPController = {
  joinODRPController,
};
