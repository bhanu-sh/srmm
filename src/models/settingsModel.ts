import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  lock: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    default: "light",
  },
});

const Settings =
  mongoose.models.settings || mongoose.model("settings", settingsSchema);

export default Settings;
