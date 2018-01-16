const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");
const APIError = require("../utils/APIError");

/**
 * Shop Schema
 * @private
 */
const shopSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    address: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128
    },
    name: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true
    },
    picture: {
      type: String,
      trim: true
    },
    loc: {
      type: [Number], // [<longitude>, <latitude>]
      index: "2d" // create the geospatial index
    }
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
shopSchema.method({
  transform() {
    const transformed = {};
    const fields = ["id", "email", "picture", "address", "createdAt", "loc"];

    fields.forEach(field => {
      transformed[field] = this[field];
    });
    //TODO:ELO: Filtrar elementos
    return this;
  }
});

/**
 * Statics
 */
shopSchema.statics = {
  /**
   * Get shop
   *
   * @param {ObjectId} id - The objectId of shop.
   * @returns {Promise<Shop, APIError>}
   */
  async get(id) {
    try {
      let shop;

      if (mongoose.Types.ObjectId.isValid(id)) {
        shop = await this.findById(id).exec();
      }
      if (shop) {
        return shop;
      }

      throw new APIError({
        message: "Shop does not exist",
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List shops in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of shops to be skipped.
   * @param {number} limit - Limit number of shops to be returned.
   * @returns {Promise<Shop[]>}
   */
  list({ page = 1, perPage = 100, name, email, address }) {
    const options = omitBy({ name, email, address }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};

/**
 * @typedef Shop
 */
module.exports = mongoose.model("Shop", shopSchema);
