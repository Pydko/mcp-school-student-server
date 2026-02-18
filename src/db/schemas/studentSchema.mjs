import mongoose from "mongoose";
import Counter from "./counterSchema.mjs";

async function getNextSequence(name) {
    const counter = await Counter.findByIdAndUpdate(
        name,
        { $inc: { seq: 1 } },
        {
            returnDocument: 'after', // DÜZELTİLDİ: Uyarıyı giderir
            upsert: true
        }
    );

    return counter.seq;
}

export const studentSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    fName: { type: String, required: true },
    sName: { type: String, required: false },
    surname: { type: String, required: true },
    classes: { type: String, required: true }
});

// DÜZELTİLDİ: async kullanıldığı için "next" parametresine gerek kalmadı
studentSchema.pre("save", async function () {
    if (this.isNew) {
        this.id = await getNextSequence("studentId");
    }
});

const Student = mongoose.model("Student", studentSchema);
export default Student;