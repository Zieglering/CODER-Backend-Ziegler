export const generateInvalidProductError = (product) => {
    return `Propiedades del producto ingresado incompletas o no validas.
    Propiedades requeridas:
    * title:        REQUERIDO - Tiene que ser un string, se recibió --> ${product.title}
    * description:  REQUERIDO - Tiene que ser un string, se recibió --> ${product.description}
    * price:        REQUERIDO - Tiene que ser un número, se recibió --> ${product.price}
    * stock:        REQUERIDO - Tiene que ser un número, se recibió --> ${product.stock}
    * code:         REQUERIDO - Tiene que ser un string, se recibió --> ${product.code}
    * category:     REQUERIDO - Tiene que ser un string, se recibió --> ${product.category}
    `
}

export const generateInvalidUserError = (user) => {
    return `Propiedades del usuario ingresado incompletas o no válidas.
    Propiedades requeridas:
    * email:        REQUERIDO - Tiene que ser un string, se recibió --> ${user.email}
    * password:     REQUERIDO - Tiene que ser un string, se recibió --> ${user.password}
    `
}