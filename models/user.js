import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : [true , "Email required"],
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
        select : false,
    },
    
})

userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) return next();

  try {
    const saltRound = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password,saltRound);
    next();

  } catch (error) {
    console.log(error.message);
    
    next(error);
  }
});



const User = mongoose.model('user',userSchema);

export default User;