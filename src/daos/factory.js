import { objectConfig } from "../config/config.js";

export let UsersDao;
export let ProductsDao;
export let CartsDao;
export let TicketsDao;
export let ChatsDao;
export let RealtimeProductsDao;


switch (objectConfig.persistence) {
    case 'MEMORY':
        const { default: ProductsDaoMemory } = await import('./MEMORY/productsDaoMemory.js');

        ProductsDao = ProductsDaoMemory;
        break;

    case 'FS':
        const { default: UsersDaoFS } = await import('./FS/usersDaoFS.js');
        const { default: ProductsDaoFS } = await import('./FS/productsDaoFS');
        const { default: CartsDaoFS } = await import('./FS/cartsDaoFS');

        UsersDao = UsersDaoFS;
        ProductsDao = ProductsDaoFS;
        CartsDao = CartsDaoFS;
        break;

    default:
        const { default: UsersDaoMongo } = await import('./MONGO/usersDaoMongo.js');
        const { default: ProductsDaoMongo } = await import('./MONGO/productsDaoMongo.js');
        const { default: CartsDaoMongo } = await import('./MONGO/cartsDaoMongo.js');
        const { default: TicketsDaoMongo } = await import('./MONGO/ticketsDaoMongo.js');
        const { default: ChatsDaoMongo } = await import('./MONGO/chatsDaoMongo.js');
        const { default: RealtimeProductsDaoFS } = await import('./FS/realTimeProductsDaoFS.js');


        UsersDao = UsersDaoMongo;
        ProductsDao = ProductsDaoMongo;
        CartsDao = CartsDaoMongo;
        TicketsDao = TicketsDaoMongo;
        ChatsDao = ChatsDaoMongo;
        RealtimeProductsDao = RealtimeProductsDaoFS;
        break;
}