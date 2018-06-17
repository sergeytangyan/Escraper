const scraper = require('./scraper');
const mailer = require('./googleMailer');
const productRepository = require('../repositories/product_repository');
const scanRepository = require('../repositories/scan_repository');

exports.scanAll = async () => {
    // get all products from db
    let products = await productRepository.selectAllPopulated();
    if (!products.length) {
        throw new Error('No records found in db');
    }

    // scrape product changes
    products = await scraper.groupScrapeChanges(products);
    if (!products.length) {
        console.log('No changes detected')
        return true;
    }

    // insert scans
    const promisesOfScanSaves = [];
    products.forEach(async (product) => {
        // console.log(`${updatedProduct._id} changed, now saving...`);
        promisesOfScanSaves.push(scanRepository.insert(product._scans[0]));
    });
    const results = await Promise.all(promisesOfScanSaves);

    // send notifications
    const mailingResult = await mailer.sendUpdates(products);
    // console.log('Mailing result: ' + mailingResult);
    return results;
};

exports.scanById = async (id) => {
    const product = await productRepository.selectPopulatedById(id);
    // return product;
    const scannedProduct = await scraper.scrapeChanges(product);

    return (scannedProduct && scannedProduct._scans[0])
        ? scanRepository.insert(scannedProduct._scans[0])
        : {};
};
