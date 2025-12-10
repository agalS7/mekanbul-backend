const Venue = require("../models/venue");

const getRating = (comments) => {
    if (!comments || comments.length === 0) return 0;

    return Math.ceil(
        comments.reduce((prev, cur) => prev + Number(cur.rating), 0) /
            comments.length,
    );
};

exports.addComment = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id).select(
            "rating comments",
        );
        if (!venue) {
            res.status(404).json({
                message: "Mekan Bulunamadı!",
            });
            return;
        }

        venue.comments.push(req.body);

        venue.rating = getRating(venue.comments);

        const response = await venue.save();
        res.status(201).json(response.comments[response.comments.length - 1]);
    } catch (e) {
        res.status(400).json({
            message: "Bir Hata Oluştu!",
        });
    }
};

exports.getComment = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id).select(
            "name comments",
        );
        if (!venue) {
            res.status(404).json({ message: "Mekan Bulunamadı!" });
            return;
        }

        const comment = venue.comments.id(req.params.commentId);
        if (!comment) {
            res.status(404).json({
                message: "Yorum Bulunamadı!",
            });
            return;
        }

        res.status(200).json({
            venue: {
                id: req.params.id,
                name: venue.name,
            },
            comment: comment,
        });
    } catch {
        res.status(404).json({ message: "Mekan Bulunamadı!" });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id).select(
            "rating comments",
        );
        if (!venue) {
            res.status(404).json({
                message: "Mekan Bulunamadı!",
            });
            return;
        }

        const comment = venue.comments.id(req.params.commentId);
        if (!comment) {
            res.status(404).json({
                message: "Yorum Bulunamadı!",
            });
            return;
        }

        comment.set(req.body);

        venue.rating = getRating(venue.comments);

        const response = await venue.save();
        res.status(201).json(response.comments.id(req.params.commentId));
    } catch {
        res.status(400).json({ message: "Bir Hata Oluştu!" });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id).select(
            "rating comments",
        );
        if (!venue) {
            res.status(404).json({
                message: "Mekan Bulunamadı!",
            });
            return;
        }

        const comment = venue.comments.id(req.params.commentId);
        if (!comment) {
            res.status(404).json({
                message: "Yorum Bulunamadı!",
            });
            return;
        }

        comment.deleteOne();

        venue.rating = getRating(venue.comments);

        await venue.save();
        res.status(200).json({
            message: `${comment.author} İsimli Kişinin Yorumu Silindi!`,
        });
    } catch {
        res.status(400).json({ message: "Bir Hata Oluştu!" });
    }
};
