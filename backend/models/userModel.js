const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    usertype: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
    },
    creator: {
      type: String,
    },
    remark: {
      type: String,
    },
    email: {
      type: String,
<<<<<<< HEAD
=======
      required: true,
>>>>>>> f9cbda4159e1e2f63160d254598efa594eabbc4a
      unique: true,
    },
    phone: {
      type: String,
    },
    photo_link: {
      type: String,
<<<<<<< HEAD

=======
      required: true,
      default:
        "https://www.seekpng.com/png/detail/73-730482_existing-user-default-avatar.png",
>>>>>>> f9cbda4159e1e2f63160d254598efa594eabbc4a
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
