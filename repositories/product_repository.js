const Product = require('../models/product').Product;


exports.insertProduct = (data) => {
    return new Promise((res, rej) => {
        (new Product(data)).save((err, prod) => {
            err ? rej(err) : res(prod);
        });
    });
};

exports.truncateProducts = () => {
    return new Promise((res, rej) => {
        Product.remove({}, (err) => {
            err ? rej(err) : res(true);
        });
    });
};

exports.selectAllPopulated = () => {
    return new Promise((res, rej) => {
        Product
            .aggregate([
                { $sort: { createdAt: -1 } },
                { $lookup: { from: 'scans', localField: '_id', foreignField: '_product', as: '_scans' } },
                // overwrite _scans with last element of _scans
                { $addFields: { _scans: { $slice: ['$_scans', -1] } } }
            ])
            .exec((err, result) => {
                err ? rej(err) : res(result);
            });
    });
};

exports.selectPopulatedById = (id, limitFlag = true) => {
    return new Promise((res, rej) => {
        const populateOptions = {
            path: '_scans',
            options: {
                sort: { createdAt: -1 },
            }
        };
        if (limitFlag) {
            populateOptions.options.limit = 1;
        }
        Product
            .findOne({ _id: id })
            .populate(populateOptions)
            .exec((err, result) => {
                if (err) {
                    rej(err);
                } else if (!result) {
                    rej('not found');
                } else {
                    res(result);
                }
            });
    });
};
