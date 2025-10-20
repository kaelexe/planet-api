import express from "express";
import {
  getTasks,
  getTask,
  addTask,
  updateTask,
  archiveTask,
  markComplete,
  markAsDone,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", addTask);
router.put("/:id", updateTask);
router.patch("/:id/archive", archiveTask);
router.patch("/:id/complete", markComplete);
router.patch("/:id/done", markAsDone);
router.delete("/:id", deleteTask);

export default router;
