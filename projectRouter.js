const express = require("express");
const Projects = require("./data/helpers/projectModel.js");
const Actions = require("./data/helpers/actionModel.js");

const router = express.Router();

/*
const errorHandler = (err, req, res, next) => {
  if (err) {
    res
      .status(500)
      .json({ message: "There was an error handling the request", err });
  }
};
*/

const verifyProjectId = async (req, res, next) => {
  try {
    const project = await Projects.get(req.params.id);
    if (project) {
      req.project = project;
      next();
    } else {
      res.status(400).json({ message: "There is no project with that id" });
    }
  } catch {
    res
      .status(500)
      .json({ message: "There was an error completing the request" });
  }
};

const verifyProjectData = (req, res, next) => {
  //need name and description
  if (req.body.description && req.body.name) {
    req.newProject = req.body;
    next();
  } else {
    res
      .status(400)
      .json({
        message: "Please provide a name and description for the project"
      });
  }
};

/*
router.get("/", async (req,res,next)=>{
  try{}catch{}
});
*/

//get all projects
router.get("/", async (req, res, next) => {
  try {
    const projects = await Projects.get();
    res.status(200).json(projects);
  } catch {
    res
      .status(500)
      .json({ message: "There was an error retrieving the information" });
  }
});

router.get("/:id", verifyProjectId, async (req, res, next) => {
  res.status(200).json(req.project);
});

router.post("/", verifyProjectData, async (req, res, next) => {
  try {
    const newProject = await Projects.insert(req.newProject);
    console.log(newProject);
  } catch {
    res.status(500).json({ message: "There was an error with the request" });
  }
});

router.put(
  "/:id",
  [verifyProjectId, verifyProjectData],
  async (req, res, next) => {
    try {
      const updateProject = await Projects.update(
        req.project.id,
        req.newProject
      );
      res.status(200).json(updateProject);
    } catch {
      res.status(500).json({ message: "There was an error with the request" });
    }
  }
);

router.delete("/:id", verifyProjectId, async (req, res, next) => {
  try {
    await Projects.remove(req.project.id);
    res.status(204).end();
  } catch {
    res.status(500).json({ message: "There was an error with the request" });
  }
});

router.get("/:id/actions", verifyProjectId, async (req, res, next) => {
  try {
    const actions = await Projects.getProjectActions(req.project.id);
    res.status(200).json(actions);
  } catch {
    res.status(500).json({ message: "There was an error with the request" });
  }
});

router.use(express.json());
router.use(verifyProjectId);
router.use(verifyProjectData);

module.exports = router;
