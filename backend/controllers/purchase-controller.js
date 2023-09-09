const router = require('express').Router();
const purchaseServices = require('../services/purchase-services');

// Get all product categories and subcategories
router.get('/category-all', purchaseServices.listAllProductCategories);

// Get all product categories
router.get('/category', purchaseServices.listProductCategories);

// Add a product category
router.post('/category', purchaseServices.addProductCategories);

// Edit a product category
router.put('/category', purchaseServices.editProductCategories);

// Get all product subcategories
router.get('/subcategory', purchaseServices.listProductSubcategories);

// Add a product subcategory
router.post('/subcategory', purchaseServices.addProductSubcategories);

// Edit a product subcategory
router.put('/subcategory', purchaseServices.editProductSubcategories);

// Get all products
router.get('/product', purchaseServices.listProducts);

// Add a product
router.post('/product', purchaseServices.addProducts);

// Edit a product
router.put('/product', purchaseServices.editProducts);

// Add a product requisition
router.post('/requisition', purchaseServices.addProductRequisition);

// Edit a product requisition
router.put('/requisition', purchaseServices.editProductRequisition);

// Get all product requisitions by status
router.get('/requisition/:status', purchaseServices.listProductRequisitions);

// Add product purchase
router.post('/pr', purchaseServices.addProductPurchase);

// Edit product purchase
router.put('/pr', purchaseServices.editProductPurchase);

// Get all product purchases by status
router.get('/pr/:status', purchaseServices.listProductPurchases);

module.exports = router;
