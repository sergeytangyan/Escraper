const mongoose = require('mongoose');


exports.openDB = () => {
    return new Promise((res, rej) => {
        mongoose.Promise = global.Promise;
        //Set up default mongoose connection

        mongoose.connect('mongodb://127.0.0.1/grigor_project')
            .catch(
                err => rej(err)
            );

        //Get the default connection
        let db = mongoose.connection;

        db.once('open', function () {
            console.log('=========================\nDb connection established');
        });

        // When the connection is disconnected
        // db.on('disconnected', function () {
        //     console.log('Mongoose default connection disconnected');
        // });

        // If the Node process ends, close the Mongoose connection 
        process.on('SIGINT', function () {
            db.close(function () {
                console.log('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });
        res(db);
    });
};

exports.closeDB = (db) => {
    return new Promise((res, rej) => {
        db.close((err) => {
            console.log('db connection closed\n=========================');
            res();
        });
    });
};
