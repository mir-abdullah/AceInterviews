import mongoose from "mongoose";

const adminSchema =mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true

    },
    password: {
        type: String,
        required: true
        },

})

adminSchema.pre('save', async function (next) {
    const admin = this;
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }
    next();
});

export default mongoose.model('Admin',adminSchema)