import { Router } from 'express'
import ChatMongoManager from '../../daos/chatMongo.manager.js'

const router = Router()
const chatMongoManager = new ChatMongoManager

router.get('/', async (req, res) => {
    try {
        const messages = await chatMongoManager.getMessages()
        res.status(200).send({status: 'success', payload: messages})
        
    } catch (error) {
        throw error
    }
})

router.post('/', async (req, res) => {
    try {
        const { user, message } = req.body
        const newMessage = await chatMongoManager.addMessage(user, message)
        res.send({status:'success', payload: newMessage})
        
    } catch (error) {
        throw error
    }
})

export default router