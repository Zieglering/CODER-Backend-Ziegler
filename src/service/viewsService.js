import { productService, cartService, userService, ticketService } from "./service.js";

class ViewsService {

  async getUsers(query) {
    const { limit, numPage } = query;
    try {
      const users = await userService.getUsers({ limit, numPage });
      return users;
    } catch (error) {
      throw new Error('Error fetching users from service.');
    }
  }

  async getUserDetails(uid) {
    const user = await userService.getUserBy({ _id: uid });
    return user;
  }

  async getProducts(query) {
    const { limit = 10, pageNum = 1, category, status, title, sortByPrice } = query;
    try {
      const products = await productService.getProducts({
        limit,
        pageNum,
        category,
        status,
        title,
        sortByPrice,
      });
      return products;
    } catch (error) {
      throw new Error('Error fetching products from service.');
    }
  }

  async getProductDetails(pid) {
    const product = await productService.getProduct({ _id: pid });
    return product;
  }

  async getCartDetails(cid) {
    const cart = await cartService.getCart({ _id: cid });
    return cart;
  }

  async getUserTickets(userEmail) {
    const tickets = await ticketService.getTickets({ purchaser: userEmail });
    return tickets;
  }

  generateMockingProducts() {
    try {
      const products = [];
      for (let i = 0; i < 100; i++) {
        products.push(generateProductsMock());
      }
      return products;
    } catch (error) {
      throw new Error('Error generating mocking products.');
    }
  }
}

export default new ViewsService();