# CODERHOUSE - Ecommerce App

## Desafío complementario
Integración sobre la app de ecommerce

- Sistema de recuperación de contraseña implementado
- Al crear un producto se guarda el email del usuario premium que lo creó en el campo owner
    si lo creó un admin o no tiene owner se guardara admin en el campo owner
- Validaciones para que un usuario premium solo pueda borrar productos que le pertenecen
    usuario premium no puede agregar productos que le pertenecen a su carrito
- Endpoint /premium/:pid para cambiar el role del usuario a premium o user



## Testing
Pruebas con postman para desafío complementario
(la cookie es necesaria para las pruebas porque trae el token de autorización)

- Creación de un producto con un usuario premium
POST http://localhost:8080/api/products

{
    "title": "title",
    "description": "description",
    "code": "code",
    "price": 99,
    "status": true,
    "stock": 999,
    "category": "cafe",
    "thumbnails": "thumbnails"
}

- borrar un producto con el usuario premium
(solo puede borrar productos que haya creado)

DELETE http://localhost:8080/api/products/:pid

- modificar el rol del usuario a "user" o "premium"
PUT http://localhost:8080/api/users/premium/:uid
{
    "role":"premium"
}



