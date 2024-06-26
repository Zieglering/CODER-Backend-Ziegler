import UsersDaoMongo from "../daos/usersDaoMongo.js";
import ProductsDaoMongo from "../daos/productsDaoMongo.js";
import CartsDaoMongo from "../daos/cartsDaoMongo.js";
import ChatDaoMongo from "../daos/chatsDaoMongo.js";

export const userService = new UsersDaoMongo();
export const productService = new ProductsDaoMongo();
export const cartService = new CartsDaoMongo();
export const chatService = new ChatDaoMongo();
export const realTimeProductsService = new ProductsDaoMongo();