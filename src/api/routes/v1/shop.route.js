const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/shop.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listShops,
  createShop,
  replaceShop,
  updateShop,
} = require('../../validations/shop.validation');

const router = express.Router();

router.param('shopId', function(request, response, next, id){
  // Do something with id
  // Store id or other info in req object
  // Call next when done
  request.shopId = id;
  next();
});

router
  .route('/')
  /**
   * @api {get} v1/shops List Shops
   * @apiDescription Get a list of shops
   * @apiVersion 1.0.0
   * @apiName ListShops
   * @apiGroup Shop
   * @apiPermission public
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Shops per page
   * @apiParam  {String}             [name]       Shop's name
   * @apiParam  {String}             [email]      Shop's email
   *
   * @apiSuccess {Object[]} shops List of shops.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated shops can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(validate(listShops), controller.list)
  /**
   * @api {post} v1/shops Create Shop
   * @apiDescription Create a new shop
   * @apiVersion 1.0.0
   * @apiName CreateShop
   * @apiGroup Shop
   * @apiPermission admin
   *
   * @apiParam  {String}             email     Shop's email
   * @apiParam  {String{..128}}      [name]    Shop's name
   *
   * @apiSuccess {String}  id         Shop's id
   * @apiSuccess {String}  name       Shop's name
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated shops can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createShop), controller.create);


router
  .route('/:shopId')
  /**
   * @api {get} v1/shops/:id Get Shop
   * @apiDescription Get shop information
   * @apiVersion 1.0.0
   * @apiName GetShop
   * @apiGroup Shop
   * @apiPermission public
   *
   * @apiSuccess {String}  id         Shop's id
   * @apiSuccess {String}  name       Shop's name
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated shops can access the data
   * @apiError (Forbidden 403)    Forbidden    Only shop with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Shop does not exist
   */
  .get(controller.get)

  /**
   * @api {put} v1/shops/:id Replace Shop
   * @apiDescription Replace the whole shop document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceShop
   * @apiGroup Shop
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {String}             email     Shop's email
   * @apiParam  {String{6..128}}     password  Shop's password
   * @apiParam  {String{..128}}      [name]    Shop's name
   *
   * @apiSuccess {String}  id         Shop's id
   * @apiSuccess {String}  name       Shop's name
   * @apiSuccess {String}  email      Shop's email
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated shops can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only shop with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Shop does not exist
   */
  .put(authorize(ADMIN), validate(replaceShop), controller.replace)
  /**
   * @api {patch} v1/shops/:id Update Shop
   * @apiDescription Update some fields of a shop document
   * @apiVersion 1.0.0
   * @apiName UpdateShop
   * @apiGroup Shop
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {String}             email     Shop's email
   * @apiParam  {String{6..128}}     password  Shop's password
   * @apiParam  {String{..128}}      [name]    Shop's name
   *
   * @apiSuccess {String}  id         Shop's id
   * @apiSuccess {String}  name       Shop's name
   * @apiSuccess {String}  email      Shop's email
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated shops can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only shop with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Shop does not exist
   */
  .patch(authorize(ADMIN), validate(updateShop), controller.update)
  /**
   * @api {patch} v1/shops/:id Delete Shop
   * @apiDescription Delete a shop
   * @apiVersion 1.0.0
   * @apiName DeleteShop
   * @apiGroup Shop
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated shops can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only shop with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Shop does not exist
   */
  .delete(authorize(ADMIN), controller.remove);


module.exports = router;
