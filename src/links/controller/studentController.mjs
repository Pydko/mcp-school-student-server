import Student from "../../db/schemas/studentSchema.mjs";
import mongoose from "mongoose";

export const addStudent = async (req, res, next) => {
  const { schoolId, fName, sName, surname, classes } = req.body;

  try {
    if (!schoolId || !fName || !surname || !classes) {
      const error = new Error("Fill in the required fields");
      error.statusCode = 400;
      throw error;
    }

    const findStudent = await Student.findOne({
      schoolId,
      fName,
      surname
    });

    if (findStudent) {
      const error = new Error("This student already exists in this school");
      error.statusCode = 409;
      throw error;
    }

    const newStudent = await Student.create({
      schoolId,
      fName,
      sName,
      surname,
      classes
    });

    res.status(201).json({
      student: `${newStudent.fName} ${newStudent.sName || ""} ${newStudent.surname}`,
      id: newStudent._id,
      message: "Successfully registered"
    });
  } catch (err) {
    next(err);
  }
};

export const getStudent = async (req, res, next) => {
  const id = req.params.id || req.body.id;

  try {
    const findStudent = await Student.findById(id);

    if (!findStudent) {
      const error = new Error("Student not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      fullName: `${findStudent.fName} ${findStudent.sName || ""} ${findStudent.surname}`,
      studentId: findStudent._id,
      message: "Success"
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentsBySchoolId = async (req, res, next) => {
  const schoolId = req.params.schoolId || req.body.schoolId;

  try {
    console.log("Incoming schoolId:", schoolId);
    console.log("Type:", typeof schoolId);

    if (!schoolId) {
      const error = new Error("SchoolId is required");
      error.statusCode = 400;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
      const error = new Error("Invalid SchoolId");
      error.statusCode = 400;
      throw error;
    }

    const objectId = new mongoose.Types.ObjectId(schoolId);
    console.log("ObjectId:", objectId);

    const students = await Student.find({ schoolId: objectId })
      .sort({ id: 1 })
      .select("fName sName surname classes id schoolId");

    console.log("Number of students found:", students.length);

    if (!students.length) {
      return res.status(404).json({
        count: 0,
        students: [],
        message: "No students found for this school"
      });
    }

    res.status(200).json({
      count: students.length,
      students,
      message: "Success"
    });

  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};
