const express = require("express");
const Actions = require("./data/helpers/actionModel.js");

const router = express.Router();

const verifyActionId = async (req, res, next) => {
  try {
    const action = await Actions.get(req.params.id);
    if (action) {
      req.action = action;
      next();
    } else {
      res.status(400).json({ message: "There is no action with that id" });
    }
  } catch {
    res
      .status(500)
      .json({ message: "There was an error completing the request" });
  }
};

// Is the action model supposed to serve up all actions? A little confusing here... It servers a weird object regarding fulfillment
/*router.get("/", async (req, res, next) => {
  try {
    const actions = Actions.get();
    res.status(200).json(actions);
  } catch {
    res
      .status(500)
      .json({ message: "There was an error completing the request" });
  }
});*/

router.get("/:id", verifyActionId, (req, res, next) => {
  res.status(200).json(req.action);
});

router.use(express.json());
router.use(verifyActionId);

module.exports = router;
