import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  lock: {
    type: Boolean,
    default: false,
  },
  maintenance: {
    type: Boolean,
    default: false,
  },
});

const Setting =
  mongoose.models.setting || mongoose.model("setting", settingSchema);

export default Setting;
