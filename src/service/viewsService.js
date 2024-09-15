import { productService, cartService, userService, ticketService } from "./service.js";

class ViewsService {

  async getUsers(query) {
    try {
      return await userService.getUsers(query);
    } catch (error) {
      throw new Error('Error al buscar usuarios');
    }
  }

  async getUserDetails(uid) {
    return await userService.getUserBy({ _id: uid });
  }

  async getProducts(query) {
    try {
      return await productService.getProducts(query);
    } catch (error) {
      throw new Error('Error al buscar productos');
    }
  }

  async getProductDetails(pid) {
    return await productService.getProductBy({ _id: pid });
  }

  async getCartDetails(cid) {
    return await cartService.getCartBy({ _id: cid });
  }

  async getUserTickets(userEmail) {
    return await ticketService.getTicketBy({ purchaser: userEmail });
  }

  generateMockingProducts() {
    try {
      const products = [];
      for (let i = 0; i < 100; i++) {
        products.push(generateProductsMock());
      }
      return products;
    } catch (error) {
      throw new Error('Error al generar mock products');
    }
  }
}

export default new ViewsService();