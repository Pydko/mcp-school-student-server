import mongoose from "mongoose";
import Counter from "./counterSchema.mjs";

async function getNextSequence(name) {
    const counter = await Counter.findByIdAndUpdate(
        name,
        { $inc: { seq: 1 } },
        {
            returnDocument: 'after',
            upsert: true
        }
    );

    return counter.seq;
}

export const schoolSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true, unique: true },
    year: { type: String, required: true },
});


schoolSchema.pre("save", async function () {
    if (this.isNew) {
        this.id = await getNextSequence("schoolId");
    }
});

const School = mongoose.model("School", schoolSchema);
export default School;