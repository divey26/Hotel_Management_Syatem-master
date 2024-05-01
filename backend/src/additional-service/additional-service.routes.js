const express = require("express");
const router = express.Router();
const additionalServiceController = require("./additional-service.controller");
const { verifyToken } = require("../auth/auth");

router.post(
  "/",
  additionalServiceController.createAdditionalService
);
router.get(
  "/",
  additionalServiceController.getAdditionalServices
);
router.get(
  "/:id",
  additionalServiceController.getAdditionalServiceById
);
router.put(
  "/:id",
  additionalServiceController.updateAdditionalService
);
router.delete(
  "/:id",
  additionalServiceController.deleteAdditionalService
);

module.exports = router;
