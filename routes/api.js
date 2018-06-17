const express = require('express');
const router = express.Router();
const productRepository = require('../repositories/product_repository');
const productScanner = require('../services/priceScanner');


router.post('/product', function (req, res, next) {
  productRepository.insertProduct(req.body)
    .then(product => res.json(product))
    .catch(err => res.status(409).json(err));
});

router.post('/product/:id/scan', function (req, res, next) {
  productScanner.scanById(req.params.id)
    .then((result) => res.json(result))
    .catch(err => res.status(409).json(err));
});

router.get('/product/truncate', function (req, res, next) {
  productRepository.truncateProducts().then(result => {
    res.json(result);
  })
});

router.get('/test', function (req, res, next) {
  require('../repositories/product_repository')
    .selectAllPopulated()
    // .insert({
    //   _product: '5b2682a290784614d87d4fa2',
    //   price: 0,
    //   discountedPrice: 0
    // })
    .then(scan => res.json(scan));
});

module.exports = router;
