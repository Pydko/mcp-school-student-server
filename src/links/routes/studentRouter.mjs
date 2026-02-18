import { Router } from "express";
import { addStudent,getStudent,getStudentsBySchoolId } from "../controller/studentController.mjs";

const stuRouter = Router();

stuRouter.post("/add", addStudent);
stuRouter.get("/get/:id", getStudent);
stuRouter.get("/school/:schoolId", getStudentsBySchoolId); 

export default stuRouter;