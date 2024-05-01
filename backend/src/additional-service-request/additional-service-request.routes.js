const express = require("express");
const router = express.Router();
const additionalServicerequestController = require("./additional-service-request.controller");
const { verifyToken } = require("../auth/auth");

router.post(
  "/",
  additionalServicerequestController.createAdditionalServicerequest
);
router.get(
  "/",
  additionalServicerequestController.getAdditionalServicerequests
);
router.get(
  "/user/:id",
  additionalServicerequestController.getAdditionalServicerequestsByUserId
);
router.get(
  "/:id",
  additionalServicerequestController.getAdditionalServicerequestById
);
router.put(
  "/:id",
  additionalServicerequestController.updateAdditionalServicerequest
);
router.delete(
  "/:id",
  additionalServicerequestController.deleteAdditionalServicerequest
);

module.exports = router;
