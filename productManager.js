const fs = require('node:fs');
const path = "./Products.json";

class ProductManager {
    

    constructor(path) {
        this.path = path;
        
    }
    async readProductsJson() {
        try {
            const productsJson = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(productsJson);
        } catch (error) {
            return [];
        }
        
    }

    async writeProduct(productsData) {
        await fs.promises.writeFile(this.path, JSON.stringify(productsData, null, '\t'), 'utf-8');
    }
    
    async getProducts() {
        return await this.readProductsJson();
    }
 
    
    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
        const product = {
            id: await this.getNextId(),
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        };
        
        const productsData = await this.readProductsJson();

        const codeExistsCheck = productsData.find((prod) => prod.code === code);
        
        let completeProductCheck = [];
        for (const prop in product) {
            if (!product[prop]) {
                completeProductCheck.push(prop);
            }
        }
        

        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock){
            if(completeProductCheck.length > 1) {
                throw new Error(`¡ERROR! debe llenar todods los campos del producto nuevo\nFaltaron agregar ${completeProductCheck.join(', ')}`);
            } else {
                throw new Error(`¡ERROR! debe llenar todods los campos del producto nuevo\nFaltó agregar ${completeProductCheck.join(', ')}`);
            }   
        } else if(codeExistsCheck){
            throw new Error(`¡ERROR! Producto ${product.title} no agregado\nEl código ${product.code} ya está siendo utlizado por el producto ${codeExistsCheck.title}, con el id ${codeExistsCheck.id}`);
            } 
            
            productsData.push(product);
            this.writeProduct(productsData)
            return productsData
            
        } catch (error) {
            return error;
        }
            
    };
    
    async getProductsById(productId) {
        try {
            const productsData = await this.readProductsJson();

            const idCheck = productsData.find((prod) => prod.id === productId);
            
            if (idCheck) {
                return `Este es el producto con el id ${productId}\n${JSON.stringify(idCheck, null, '\t')}`;
            } else {
                throw new Error(`¡ERROR! No existe ningún producto con el id ${productId}`);
              };
        } 
    
          catch (error) {
            return error;
            
          }
    };   

    async updateProduct(productId, updatedProduct) {
        try {
            const productsData = await this.readProductsJson();
            const productIndex = productsData.findIndex(product => product.id === productId);

            if(productIndex === -1){
                throw new error(`El Producto con el id: ${productId} no existe`);
            }
            
            const newUpdatedProduct = {
                ...productsData[productIndex],
                ...updatedProduct
            };
            
            productsData[productIndex] = newUpdatedProduct;
            
            
            this.writeProduct(productsData)
            return productsData;

            
        } catch (error) {
            return error;
        }

    }

    async deleteProduct(productId) {
        const productsData = await this.readProductsJson();
        
        const productToDeleteIndex = productsData.findIndex(product => product.id === productId);
        if (productToDeleteIndex === -1) {
            return `No existe el producto con id: ${productId}`;
        }
        console.log(`EL producto ${productsData[productToDeleteIndex].title} con el id ${productId} fue eliminado`);
        productsData.splice(productToDeleteIndex, 1);
        this.writeProduct(productsData)
        };   
    
        
    async getNextId() {
        const productsData = await this.readProductsJson();
            if (productsData.length === 0) {
                return 1;
              };
              return productsData[productsData.length -1].id + 1;
    };
};