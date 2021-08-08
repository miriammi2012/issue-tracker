const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const projectSchema = new Schema({
  project: {
    type: String,
    required: true,
    unique: true
  },
  issues:[{ type: Schema.Types.ObjectId, ref: 'issues' }]
})

const Project = mongoose.model('projects',projectSchema);

module.exports = Project;
