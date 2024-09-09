export default class ProductsRepository {
    constructor(productsDao) {
        this.productsDao = productsDao;
    }

    getProducts = async (filter) => await this.productsDao.getAll(filter);
    getProduct = async (filter) => await this.productsDao.getBy(filter);
    createProduct = async (product) => await this.productsDao.create(product);
    updateProduct = async (pid, productToUpdate) => await this.productsDao.update(pid, productToUpdate);
    deleteProduct = async pid => await this.productsDao.delete(pid);
}