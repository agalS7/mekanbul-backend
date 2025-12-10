const Venue = require("../models/venue");

const converter = (() => {
    const earthRadius = 6371; // km
    const radian2Kilometer = (radian) => {
        return radian * earthRadius;
    };
    const kilometer2Radian = (distance) => {
        return distance / earthRadius;
    };

    return {
        radian2Kilometer,
        kilometer2Radian,
    };
})();

exports.listVenues = async (req, res) => {
    const lat = parseFloat(req.query.lat) || 0;
    const long = parseFloat(req.query.long) || 0;

    const point = { type: "Point", coordinates: [lat, long] };
    const geoOptions = {
        distanceField: "distance",
        spherical: true,
        maxDistance: converter.radian2Kilometer(100),
    };

    try {
        const result = await Venue.aggregate([
            {
                $geoNear: {
                    near: point,
                    ...geoOptions,
                },
            },
        ]);

        if (!result) {
            res.status(404).json({
                message: "Civarda mekan yok!",
            });
        }

        const venues = result.map((venue) => ({
            distance: converter.kilometer2Radian(venue.distance),
            name: venue.name,
            address: venue.address,
            rating: venue.rating,
            foodanddrink: venue.foodanddrink,
            id: venue._id,
        }));

        if (venues.length > 0) {
            res.status(200).json(venues);
        } else {
            res.status(404).json({ message: "Civarda mekan yok!" });
        }
    } catch {
        res.status(404).json({ message: "Civarda mekan yok!" });
    }
};

exports.addVenue = async (req, res) => {
    try {
        const response = await new Venue({
            ...req.body,
            coordinates: [req.body.lat, req.body.long],
            hours: [
                {
                    days: req.body.days1,
                    open: req.body.open1,
                    close: req.body.close1,
                    isClosed: req.body.isClosed1,
                },
                {
                    days: req.body.days2,
                    open: req.body.open2,
                    close: req.body.close2,
                    isClosed: req.body.isClosed2,
                },
            ],
        }).save();

        res.status(201).json(response);
    } catch {
        res.status(400).json({ message: "Veri oluşturulurken hata oluştu!" });
    }
};

exports.getVenue = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            res.status(404).json({ message: "Mekan Bulunamadı" });
            return;
        }

        res.status(200).json(venue);
    } catch {
        res.status(404).json({ message: "Mekan Bulunamadı!" });
    }
};

exports.updateVenue = async (req, res) => {
    try {
        const response = await Venue.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                coordinates: [req.body.lat, req.body.long],
                hours: [
                    {
                        days: req.body.days1,
                        open: req.body.open1,
                        close: req.body.close1,
                        isClosed: req.body.isClosed1,
                    },
                    {
                        days: req.body.days2,
                        open: req.body.open2,
                        close: req.body.close2,
                        isClosed: req.body.isClosed2,
                    },
                ],
            },
            { new: true },
        );

        res.status(201).json(response);
    } catch {
        res.status(400).json({ message: "Veri Güncellenirken Hata Oluştu!" });
    }
};

exports.deleteVenue = async (req, res) => {
    try {
        const venue = await Venue.findByIdAndDelete(req.params.id);
        if (!venue) {
            res.status(404).json({
                message: "Mekan Bulunamadı!",
            });
        }

        res.status(200).json({
            message: `${venue.name} İsimli Mekan Silindi!`,
        });
    } catch {
        res.status(404).json({
            message: "Mekan Bulunamadı!",
        });
    }
};
