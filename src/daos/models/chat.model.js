import {Schema, model} from 'mongoose'

const chatsSchema = new Schema ({
    user:string,
    message:String
})

export const chatsModel = model('chats', chatsSchema)