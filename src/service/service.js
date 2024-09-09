import UsersRepository from "../repositories/usersRepository.js";
import ProductsRepository from "../repositories/productsRepository.js";
import CartsRepository from "../repositories/cartsRepository.js";
import TicketsRepository from "../repositories/ticketsRepository.js";
import ChatsRepository from "../repositories/chatsRepository.js";
import RealTimeProductsRepository from "../repositories/realTimeProductsRepository.js";
import { CartsDao, ChatsDao, ProductsDao, RealtimeProductsDao, TicketsDao, UsersDao } from "../daos/factory.js";
import ProductService from "./productService.js";
import UserService from "./userService.js";
import CartService from "./cartService.js";
import TicketService from "./ticketService.js";
import ChatService from "./chatService.js";
import RealTimeProductsService from "./realTimeProductService.js";

// Repositories
const userRepository = new UsersRepository(new UsersDao());
const productRepository = new ProductsRepository(new ProductsDao());
const cartRepository = new CartsRepository(new CartsDao());
const ticketRepository = new TicketsRepository(new TicketsDao());
const chatRepository = new ChatsRepository(new ChatsDao());
const realTimeProductsRepository = new RealTimeProductsRepository(new RealtimeProductsDao());

// Services
export const userService = new UserService(userRepository, cartRepository);
export const productService = new ProductService(productRepository, userService);
export const ticketService = new TicketService(ticketRepository);
export const chatService = new ChatService(chatRepository);
export const realTimeProductsService = new RealTimeProductsService(realTimeProductsRepository);
export const cartService = new CartService(cartRepository, productService, ticketService, userService);