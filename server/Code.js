const {Schema , model} = require('mongoose');

const Code = new Schema({
    _id:String,
    data : Object,
})

module.exports = model("Code",Code);