const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GKEY
});

function googleAddressQuery(req, res) {
    googleMapsClient.geocode({
        address: req.query.q
    }, function(err, data) {
        if (!err) {
            res.status(200).json(data.json.results[0]);
        }
    });
}

module.exports = {
    googleAddressQuery: googleAddressQuery
};
