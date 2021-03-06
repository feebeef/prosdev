const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
    }
},  { versionKey: false })



doctorSchema.statics.getAll = async function(){
    return await this.find();
}

doctorSchema.statics.getByID = async function(data){
    return await this.findOne({ _id: data });
};


doctorSchema.statics.getAppointmentDoctor = async function(data){
    return await this.find({})
};

doctorSchema.statics.add = async function(data){
     return await (new Doctor(data)).save()
};




doctorSchema.statics.delete = async function(data){
    return await this.findByIdAndRemove(data._id);
}

doctorSchema.statics.update = async function(data){
    return await this.findOneAndUpdate({_id: data._id}, {$set: data.update}, {new: true}); 
};

const Doctor = mongoose.model("doctor", doctorSchema)

module.exports = {
    Doctor
}