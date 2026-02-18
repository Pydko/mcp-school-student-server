import School from "../../db/schemas/schoolSchema.mjs";

export const addSchool = async (req, res, next) => {
  const { name, year } = req.body;

  try {
    if (!name || !year) {
      const error = new Error("Please fill in all required fields");
      error.statusCode = 400;
      throw error;
    }

    const existingSchool = await School.findOne({ name });

    if (existingSchool) {
      const error = new Error("School already exists");
      error.statusCode = 409;
      throw error;
    }

    const newSchool = await School.create({ name, year });

    res.status(201).json({
      school: newSchool.name,
      schoolId: newSchool._id,
      message: "School created successfully"
    });
  } catch (err) {
    next(err);
  }
};

export const getSchool = async (req, res, next) => {
  const id = req.params.id || req.body.id;

  try {
    const school = await School.findById(id);

    if (!school) {
      const error = new Error("School not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      name: school.name,
      year: school.year,
      schoolId: school._id
    });
  } catch (err) {
    next(err);
  }
};

export const getAllSchools = async (req, res, next) => {
  try {
    const schools = await School.find().sort({ _id: 1 });

    res.status(200).json({
      count: schools.length,
      schools
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSchool = async (req, res, next) => {
  const id = req.params.id;

  try {
    const school = await School.findByIdAndDelete(id);

    if (!school) {
      const error = new Error("School not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "School deleted successfully",
      school: school.name
    });
  } catch (err) {
    next(err);
  }
};
