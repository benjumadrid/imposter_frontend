import express from "express";
import * as usersController from "../controllers/usersController.js";

const router = express.Router();

// CRUD
router.post("/register", usersController.createUser);      // POST /api/users/register
router.get("/list", usersController.getAllUsers);          // GET /api/users/list
router.get("/profile/:id", usersController.getUserById);   // GET /api/users/profile/:id
router.put("/update/:id", usersController.updateUser);     // PUT /api/users/update/:id
router.delete("/remove/:id", usersController.deleteUser);  // DELETE /api/users/remove/:id

// Login
router.post("/login", usersController.loginUser);          // POST /api/users/login

export default router;
