const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const issueSchema = new Schema({
    issue_title: {type: String,required: true},
    issue_text: {type: String,required: true},
    created_by: {type: String,required: true},
    assigned_to: {type: String,default: ''},
    open: {type: Boolean,default: true},
    status_text: {type: String,default: ''}

},{
  timestamps: {
    createdAt: 'created_on',
    updatedAt: 'updated_on'
  }
})
const Issue = mongoose.model('issues',issueSchema);

const projectSchema = new Schema({
  project: {
    type: String,
    required: true,
    unique: true
  },
  issues:[{ type: Schema.Types.ObjectId, ref: 'issues' }]
})

const Project = mongoose.model('projects',projectSchema);

module.exports = {
  Issue,Project
}