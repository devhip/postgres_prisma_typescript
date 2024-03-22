import express from "express"
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../controllers/userController"

// สร้าง express router
const router = express.Router()

// สร้าง route สำหรับสร้าง user
router.post("/", createUser)

// สร้าง route สำหรับดึง user ทั้งหมด
router.get("/",getUsers)

// สร้าง route สำหรับดึง user By Id
router.get("/:userId",getUserById)

// สร้าง route สำหรับดึง user By Id
router.put("/:userId",updateUser)

// สร้าง route สำหรับดึง user By Id
router.delete("/:userId",deleteUser)
export default router