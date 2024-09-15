export default class RealTimeProductsRepository {
    constructor(realtimeProductsDao) {
        this.realtimeProductsDao = realtimeProductsDao;
    }

    getProducts = async (filter) => await this.realtimeProductsDao.getAll(filter);
    getProductBy = async filter => await this.realtimeProductsDao.getBy(filter);
    createProduct = async newProduct => await this.realtimeProductsDao.create(newProduct);
    updateProduct = async (pid, productToUpdate) => await this.realtimeProductsDao.update(pid, productToUpdate);
    deleteProduct = async pid => await this.realtimeProductsDao.delete(pid);
}