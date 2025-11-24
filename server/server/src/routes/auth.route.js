import {Router} from "express";
import { 
    login, 
    logout,
    getCurrentUser,
    register,
    authMe
} from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/register", register);
authRoutes.get("/me", getCurrentUser);
authRoutes.get("/auth-me", authMe);


export default authRoutes;



