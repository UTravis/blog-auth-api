import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type:String, required: true}
}, {timestamps: true});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = models.User || model("User", userSchema);

export default User;