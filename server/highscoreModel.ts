import mongoose, { type Document } from "mongoose";

export interface IHighscore extends Document {
  name: string;
  time: number;
  guesses: string[];
  wordLength: number;
  uniqueOnly: boolean;
}

const highscoreSchema = new mongoose.Schema<IHighscore>(
  {
    name: { type: String, required: true },
    time: { type: Number, required: true },
    guesses: { type: [String], required: true },
    wordLength: { type: Number, required: true },
    uniqueOnly: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IHighscore>("Highscore", highscoreSchema);
