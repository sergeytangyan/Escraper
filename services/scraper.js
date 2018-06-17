const r = require('request-promise-native');
const cheerio = require('cheerio');
const configs = require('../configs');
const Scan = require('../models/scan').Scan;

const transformer = (body) => {
    return cheerio.load(body);
};

exports.scrapeChanges = async (product) => {
    const productStore = product.sourceStore;

    const $ = await r(Object.assign(
        { uri: product.sourceLink, transform: transformer },
        { headers: configs[productStore].headers }
    ));

    const scrapedPrice = parseFloat(await $(configs[productStore].priceSelector).text()) || 0;
    const scrapedDiscountedPrice = parseFloat(await $(configs[productStore].discountedPriceSelector).text()) || 0;

    if (product._scans.length > 0) {
        const previousScan = product._scans[0];
        if (scrapedPrice === previousScan.price && scrapedDiscountedPrice === previousScan.discountedPrice) {
            return false;
        }
    }

    product._scans[0] = new Scan({ price: scrapedPrice, discountedPrice: scrapedDiscountedPrice, _product: product._id });
    return product;
};

exports.groupScrapeChanges = async (products) => {
    let promisesOfProducts = [];
    products.forEach(product => {
        promisesOfProducts.push(this.scrapeChanges(product));
    });

    return await Promise.all(promisesOfProducts).then(data => data.filter(el => el));
};
