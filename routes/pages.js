var express = require('express');
var router = express.Router();
var productRepository = require('../repositories/product_repository');


router.get('/', function (req, res, next) {
  productRepository.selectAllPopulated().then(products => {
    // console.log(products);
    res.render('index', { title: 'Grigor Project', products });
  });
});

router.get('/product/:id/history', function (req, res, next) {
  productRepository.selectPopulatedById(req.params.id, false)
    .then(product => res.render('history', { product }))
    .catch(err => { 
      console.log(err);
      res.send(err.message);
    });
});

router.get('/add', function (req, res, next) {
  res.render('new_product');
});

module.exports = router;
