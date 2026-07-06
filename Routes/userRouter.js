import { Router } from "express";
import { register,getAlluser, login, otpVerify } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post('/',validation,register);

userRouter.get('/',getAlluser)

userRouter.post('/login',login);


export default userRouter;
