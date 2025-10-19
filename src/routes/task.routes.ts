import express from "express";
import { getTasks, getTask, addTask } from "../controllers/task.controller.js";

const router = express.Router();

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", addTask);

export default router;
