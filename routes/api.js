'use strict';
const Project = require('../models/Project.js');
const Issue = require('../models/Issue.js');
const { isNaN, stringToBool, isObjEmpty } = require("../utils");

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      let queryData = req.query;
      !isNaN(queryData.open) && (queryData.open = stringToBool(queryData.open));

      const projectData = await Project.find({project}).populate({
        path: 'issues',
        match: {
          ...queryData
        },
        options: {
          sort: {
            updated_on: -1
          },
          select: {
            __v: 0
          }
        }
      }).exec();
      
      if (projectData.length == 0) {
        return res.json({error: `project ${project} not found in db`});
      }
      return res.json(projectData[0].issues)
    })
    
    .post(async function (req, res){
      let project = req.params.project;
      const data = req.body;
      if (!data.issue_text || !data.issue_title || !data.created_by) {
        res.json({ error: "required field(s) missing" });
        return;
      }
      try {
        let issue = new Issue({
          ...data
        });
        await issue.save()
        let result = await Project.updateOne({project},{$push: {issues: issue}},{upsert: true});
        if (result.nModified > 0 || result.n > 0) {
          return res.json(issue);
        } else {
          return res.status(500).json({ error: "could not insert" });
        }
        return res.json(issue);
      }
      catch(err) {
        console.error(err)
        return res.status(500).json({ error: "could not insert" });
      }
    })
    
    .put(async function (req, res){
      // let project = req.params.project;
      const { _id, ...updates } = req.body;
      if (!_id) {
        return res.json({ error: "missing _id" });
      }
      !isNaN(updates.open) && (updates.open = stringToBool(updates.open));

      if (isObjEmpty(updates)) {
        return res.json({ error: "no update field(s) sent", _id });
      }
      
      try {
        let result = await Issue.updateOne({_id},{...updates});
         if (result.nModified > 0) {
            return res.json({ result: "successfully updated", _id });
          } else {
            return res.json({ error: "could not update", _id });
          }
      }
      catch(err) {
          console.error(err);
          res.json({ error: "could not update", _id });
      }
    })
    
    .delete(async function (req, res){
      // let project = req.params.project;
      const { _id } = req.body;
      if (!_id) {
        return res.json({ error: "missing _id" });
      }
      try {
        let result = await Issue.deleteOne({_id});
        if (result.deletedCount > 0) {
              return res.json({ result: "successfully deleted", _id });
        } else {
          return res.json({ error: "could not delete", _id });
        }
      }
      catch(err){
        console.error(err);
        return res.json({ error: "could not delete", _id });
      }
      
    });
    
};
