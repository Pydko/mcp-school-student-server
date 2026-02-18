import { Router } from "express";
import {addSchool,getSchool,getAllSchools,deleteSchool} from "../controller/schoolController.mjs";

const sRouter = Router();

sRouter.post("/add", addSchool);
sRouter.get("/get/:id", getSchool);
sRouter.get("/all", getAllSchools);
sRouter.delete("/delete/:id", deleteSchool);

export default sRouter;
