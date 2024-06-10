import { Router } from 'express'
import { UsersManagerMongo } from '../../daos/usersManagerMongo.js';

const router = Router()
const userService = new UsersManagerMongo;

router.get('/', async (req, res) => {
    try {
        const users = await userService.getUsers()
        res.send({status: 'success', payload: users})
        
    } catch (error) {
        res.status(500).send({ status: 'error', error: error });
    }
})

router.post('/', async (req, res) => {
    const { body } = req 
    try {
        const result = await userService.createUser(body)
        res.send({status:'success', payload: result})
        
    } catch (error) {
        res.status(500).send({ status: 'error', error: error });
    }

})

router.get('/:uid', async (req, res) => {
    const {uid} = req.params
    try {
        const userFound = await userService.getUserBy({_id: uid})
        res.send({status:'success', payload: userFound})
        
    } catch (error) {
        res.status(500).send({ status: 'error', error: error });    
    }
})

router.put('/:uid', async (req, res) => {
    const { uid } = req.params;
    const { first_name, last_name, password } = req.body;

    try {
        const userFound = await userService.getProductsBy({_id: uid});
        if (!userFound) {
            return res.status(404).send({ status: 'error', message: 'User not found' });
        }
        
        const updatedUser = {};
        if (first_name) updatedUser.first_name = first_name;
        if (last_name) updatedUser.last_name = last_name;
        if (password) updatedUser.password = password;

        if (Object.keys(updatedUser).length === 0) {
            return res.status(400).send({ status: 'error', message: 'No hay nada para actualizar' });
        }
        
        const result = await userService.updateUser({_id:uid}, updatedUser);

        if (result.nModified === 0) {
            return res.status(400).send({ status: 'error', message: 'No se hicieron cabios en el usuario' });
        }

        res.status(200).send({status: 'success', message:`Usuario actualizado ${result}`})
        
    } catch (error) {
        res.status(500).send({ status: 'Error', message: error });
    }
})
router.delete('/:uid', async (req, res) => {
    const {userEmail} = req.params
    const userFound = await userService.deleteUser({email: userEmail})
    res.send({status:'success', payload: `user: ${userFound} deleted`})
})

export default router