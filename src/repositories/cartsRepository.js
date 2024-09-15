export default class CartsRepository {
    constructor(cartsDao, productsDao) {
        this.cartsDao = cartsDao;
        this.productsDao = productsDao;
    }

    createCart = async (newCart) => await this.cartsDao.create(newCart);
    addProductToCart = async (cid, pid, quantity) => await this.cartsDao.addProductToCart(cid, pid, quantity);
    getCartBy = async (filter) => await this.cartsDao.getBy(filter);
    updateCart = async (cid, cartToUpdate) => await this.cartsDao.update(cid, cartToUpdate);
    updateProductFromCart = async (cid, pid, quantity) => await this.cartsDao.updateProductFromCart(cid, pid, quantity);
    deleteCart = async (cid) => await this.cartsDao.delete(cid);
    deleteProductFromCart = async (cid, pid) => await this.cartsDao.deleteProductFromCart(cid, pid);
}