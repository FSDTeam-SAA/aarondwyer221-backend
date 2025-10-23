import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { JoinODRPController } from "./joinODRP.controller";
import { upload } from "../../middleware/multer.middleware";

const router = Router();

router.post(
  "/new-joinOrdp",
  upload.array("documents",5),
  auth(USER_ROLE.TEACHER),
  JoinODRPController.joinODRPController
);

export const joinODRPRouter = router;
