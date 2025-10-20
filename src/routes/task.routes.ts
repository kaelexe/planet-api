import express from "express";
import {
  getTasks,
  getTask,
  addTask,
  updateTask,
  markComplete,
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", addTask);
router.put("/:id", updateTask);
router.patch("/:id/complete", markComplete);
router.patch("/test", (req, res) => {
  res.send("PATCH route works!");
});
router.patch("/testing", (req, res) => {
  res.send("PATCH route works!");
});

export default router;
