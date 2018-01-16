const httpStatus = require('http-status');
const { omit } = require('lodash');
const Shop = require('../models/shop.model');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Get shop
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const shop = await Shop.get(req.shopId);
    res.json(shop.transform());
  } catch (error) {
    next(error);
  }
};
/**
 * Create new shop
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const shop = new Shop(req.body);
    const savedShop = await shop.save();
    res.status(httpStatus.CREATED);
    res.json(savedShop.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing shop
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { shop } = req.locals;
    const newShop = new Shop(req.body);
    const ommitRole = shop.role !== 'admin' ? 'role' : '';
    const newShopObject = omit(newShop.toObject(), '_id', ommitRole);

    await shop.update(newShopObject, { override: true, upsert: true });
    const savedShop = await Shop.findById(shop._id);

    res.json(savedShop.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing shop
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.shop.role !== 'admin' ? 'role' : '';
  const updatedShop = omit(req.body, ommitRole);
  const shop = Object.assign(req.locals.shop, updatedShop);

  shop.save()
    .then(savedShop => res.json(savedShop.transform()))
    .catch(e => next(e));
};

/**
 * Get shop list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const shops = await Shop.list(req.query);
    const transformedShops = shops.map(shop => shop.transform());
    res.json(transformedShops);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete shop
 * @public
 */
exports.remove = (req, res, next) => {
  const { shop } = req.locals;

  shop.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
