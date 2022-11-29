const express = require("express");
const Router = express.Router();
const { body, validationResult } = require("express-validator");

// Load JSON model
const Json = require("../../models/Json");
const authenticate = require("../../middlewares/auth");

//Post Router api/json/upload
Router.post(
  "/upload",
  [body("name").notEmpty(), body("data").notEmpty()],
  authenticate,
  async (req, res) => {
    try {
      const errors = validationResult(req);

      //Check Validation
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, data, grammarfor, private } = req.body;
      const ownerid = req?.user.id;
      const exists = await Json.findOne({ name });

      if (exists) {
        return res.status(400).json({
          message: "JSON file with this name already exists",
        });
      }

      const newJson = new Json({
        name,
        data,
        ownerid,
        grammarfor,
        private,
      });

      await newJson.save();
      res.status(200).json({ message: "File Uploaded successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Cannot upload JSON file" });
    }
  }
);

Router.get("/my", authenticate, async (req, res) => {
  try {
    const ownerid = req?.user.id;
    const jsonfiles = await Json.find({ ownerid }).populate("ownerid").exec();
    res.status(200).json(jsonfiles);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch your json files" });
  }
});

Router.get("/all", authenticate, async (req, res) => {
  try {
    const jsonfiles = await Json.find({ private: false })
      .populate("ownerid")
      .exec();
    res.status(200).json(jsonfiles);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch your json files" });
  }
});

Router.get("/scene", authenticate, async (req, res) => {
  try {
    const owner = req?.user.id;
    const jsonfiles = await Json.find({
      $or: [{ private: false }, { ownerid: owner }],
      $and: [{ grammarfor: "scene" }],
    })
      .populate("ownerid")
      .exec();
    res.status(200).json(jsonfiles);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch your json files" });
  }
});

Router.get("/action", authenticate, async (req, res) => {
  try {
    const owner = req?.user.id;
    const jsonfiles = await Json.find({
      $or: [{ private: false }, { ownerid: owner }],
      $and: [{ grammarfor: "action" }],
    })
      .populate("ownerid")
      .exec();
    res.status(200).json(jsonfiles);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch your json files" });
  }
});

Router.get("/asset", authenticate, async (req, res) => {
  try {
    const owner = req?.user.id;
    const jsonfiles = await Json.find({
      $or: [{ private: false }, { ownerid: owner }],
      $and: [{ grammarfor: "asset" }],
    })
      .populate("ownerid")
      .exec();
    res.status(200).json(jsonfiles);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch your json files" });
  }
});

Router.get("/recent", authenticate, async (req, res) => {
  try {
    const ownerid = req?.user.id;
    const recentjson = await Json.find({ ownerid })
      .sort({ updatedAt: -1 })
      .limit(5);
    return res.status(200).send(recentjson);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot fetch the files" });
  }
});

Router.get("/:json_id", authenticate, async (req, res) => {
  try {
    const jsonfile = await Json.findById(req.params.json_id);
    if (!jsonfile) {
      return res.status(400).send({ message: "Json file not fount" });
    }

    return res.status(200).send(jsonfile);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot update the JSON file" });
  }
});

Router.patch("/:json_id", authenticate, async (req, res) => {
  try {
    const jsonfile = await Json.findById(req.params.json_id);
    const ownerid = req?.user.id;
    if (jsonfile.ownerid.toString() !== ownerid) {
      return res
        .status(401)
        .send({ message: "You are not authorized to update this file" });
    }

    const { name, data, grammarfor, private } = req.body;

    const updatejson = await Json.findByIdAndUpdate(
      req.params.json_id,
      { name, data, ownerid, grammarfor, private },
      { new: true }
    );

    return res.status(200).send({ message: "Json Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot update the JSON file" });
  }
});

Router.delete("/:json_id", authenticate, async (req, res) => {
  try {
    const jsonfile = await Json.findById(req.params.json_id);
    const ownerid = req?.user.id;
    if (jsonfile.ownerid.toString() !== ownerid) {
      return res
        .status(401)
        .send({ message: "You are not authorized to delete this file" });
    }

    await Json.findByIdAndDelete(req.params.json_id);

    return res.status(200).send({ message: "Json deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Cannot delete the JSON file" });
  }
});

module.exports = Router;
