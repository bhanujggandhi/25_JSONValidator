const express = require("express");
const Router = express.Router();
const { body, validationResult } = require("express-validator");

// Load Project model
const Project = require("../../models/Project");
const authenticate = require("../../middlewares/auth");

//Post Router /api/project/new
Router.post(
  "/new",
  [body("name").notEmpty()],
  authenticate,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      //Check Validation
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name } = req.body;
      const ownerid = req?.user.id;
      const exists = await Project.findOne({ name });

      if (exists) {
        return res.status(400).json({
          message: "Project with this name already exists",
        });
      }

      const newProject = new Project({
        name,
        ownerid,
      });

      await newProject.save();

      const ret = await Project.findById(newProject._id)
        .populate("ownerid")
        .exec();
      res.status(200).send(ret);
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Cannot create the project" });
    }
  }
);

Router.get("/my", authenticate, async (req, res) => {
  try {
    const ownerid = req?.user.id;
    const projects = await Project.find({ ownerid }).populate("ownerid").exec();
    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch your projects" });
  }
});

Router.get("/recent", authenticate, async (req, res) => {
  try {
    const ownerid = req?.user.id;
    const project = await Project.find({ ownerid })
      .sort({ updatedAt: -1 })
      .limit(3);
    return res.status(200).send(project);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch the project" });
  }
});

Router.get("/:projectid", authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectid);
    if (!project) {
      return res.status(400).send({ message: "Project not found" });
    }

    return res.status(200).send(project);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch the project" });
  }
});

Router.patch("/:projectid/scene", authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectid);
    if (!project) {
      return res.status(400).send({ message: "Project not found" });
    }
    console.log(project);
    if (project.action.length > 0 && project.asset.length > 0) {
      await Project.findByIdAndUpdate(req.params.projectid, {
        scene: req.body.data,
        step: 1,
        isFinished: true,
      });
    } else {
      await Project.findByIdAndUpdate(req.params.projectid, {
        scene: req.body.data,
        step: 1,
      });
    }

    return res.status(200).send({ message: "Scene JSON added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch the project" });
  }
});

Router.get("/:projectid/scene", authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectid).select({
      asset: 0,
      action: 0,
    });
    if (!project) {
      return res.status(400).send({ message: "Project not found" });
    }

    return res.status(200).send(project);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch the project" });
  }
});

Router.patch("/:projectid/asset", authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectid);
    if (!project) {
      return res.status(400).send({ message: "Project not found" });
    }
    console.log(project);
    if (project.scene.length > 0 && project.action.length > 0) {
      await Project.findByIdAndUpdate(req.params.projectid, {
        asset: req.body.data,
        step: 2,
        isFinished: true,
      });
    } else {
      await Project.findByIdAndUpdate(req.params.projectid, {
        asset: req.body.data,
        step: 2,
      });
    }

    return res.status(200).send({ message: "Asset JSON added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch the project" });
  }
});

Router.get("/:projectid/asset", authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectid).select({
      scene: 0,
      action: 0,
    });
    if (!project) {
      return res.status(400).send({ message: "Project not found" });
    }

    return res.status(200).send(project);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch the project" });
  }
});

Router.patch("/:projectid/action", authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectid);
    if (!project) {
      return res.status(400).send({ message: "Project not found" });
    }

    if (project.scene.length > 0 && project.asset.length > 0) {
      await Project.findByIdAndUpdate(req.params.projectid, {
        action: req.body.data,
        step: 2,
        isFinished: true,
      });
    } else {
      await Project.findByIdAndUpdate(req.params.projectid, {
        action: req.body.data,
        step: 2,
      });
    }

    return res.status(200).send({ message: "Action JSON added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch the project" });
  }
});

Router.get("/:projectid/action", authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectid).select({
      asset: 0,
      scene: 0,
    });
    if (!project) {
      return res.status(400).send({ message: "Project not found" });
    }

    return res.status(200).send(project);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch the project" });
  }
});

module.exports = Router;
