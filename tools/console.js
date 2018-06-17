const dbMaster = require('./dbMaster');
const priceScanner = require('../services/priceScanner');


let runProcess = async () => {
    let db;
    try {
        db = await dbMaster.openDB();
        await priceScanner.scanAll();
    } catch (e) {
        console.log(`Error caught (${e})`);
    } finally {
        if (db) { await dbMaster.closeDB(db); }
    }
};

runProcess();