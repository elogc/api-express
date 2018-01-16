const Joi = require('joi');
const Shop = require('../models/shop.model');

module.exports = {

  // GET /v1/shops
  listShops: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
    },
  },

  // POST /v1/shops
  createShop: {
    body: {
      email: Joi.string().email().required(),
      address: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
    },
  },

  // PUT /v1/shops/:shopId
  replaceShop: {
    body: {
      email: Joi.string().email().required(),
      address: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
    },
    params: {
      shopId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/shops/:shopId
  updateShop: {
    body: {
      email: Joi.string().email(),
      address: Joi.string().min(6).max(128),
      name: Joi.string().max(128),
    },
    params: {
      shopId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
