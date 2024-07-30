export default class ProductsRepository {
    constructor(productsDao) {
        this.productsDao = productsDao;
    }

    getProducts = async (filter) => await this.productsDao.getAll(filter);
    getProduct = async (filter) => await this.productsDao.getBy(filter);
    createProduct = async (title, description, code, price, status, stock, category, thumbnails, owner) => await this.productsDao.create(title, description, code, price, status, stock, category, thumbnails, owner);    updateProduct = async (pid, productToUpdate) => await this.productsDao.update(pid, productToUpdate);
    deleteProduct = async pid => await this.productsDao.remove(pid);
}