const Scan = require('../models/scan').Scan;


exports.insert = (data) => {
    return new Promise((res, rej) => {
        (new Scan(data)).save((err, scan) => {
            err ? rej(err) : res(scan);
        });
    });
};
