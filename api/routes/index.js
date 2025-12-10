const express = require("express");
const router = express.Router();
const venueController = require("../controllers/VenueController");
const commentController = require("../controllers/CommentController");

router
    .route("/venues")
    .get(venueController.listVenues)
    .post(venueController.addVenue);

router
    .route("/venues/:id")
    .get(venueController.getVenue)
    .put(venueController.updateVenue)
    .delete(venueController.deleteVenue);

router.route("/venues/:id/comments").post(commentController.addComment);

router
    .route("/venues/:id/comments/:commentId")
    .get(commentController.getComment)
    .put(commentController.updateComment)
    .delete(commentController.deleteComment);

module.exports = router;
