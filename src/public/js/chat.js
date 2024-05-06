// console.log('Bienvenido al chat')

// const socket = io()

// // emit manda o emite un evento
// socket.emit('message', 'esto es data en forma de string')

// socket.on('socket_individual', data => {
//     console.log(data)
// })

// socket.on('para_todos_menos_el_actual', data => {
//     console.log(data)
// })

// socket.on('eventos_para_todos', data => {
//     console.log(data)
// })



const socket = io()
let user
const chatBox = document.querySelector('#chatBox')


// input del user
Swal.fire({
    title:'Identificate',
    input:'text',
    text:'Ingresa el usuario para identificarte en el chat',
    inputValidator: value => {
        return !value && 'Necesitas escribir un nombre de usuario para continuar'
    },
    allowOutsideClick: false
})
.then(result => {
    user = result.value
    console.log(user)
})

// input del chat
chatBox.addEventListener('keyup', evt => {
    if(evt.key === 'Enter'){
        if(chatBox.value.trim(). length > 0 ){
            socket.emit('message', { user, message: chatBox.value})
            chatBox.value = ''
        }
    }
})

socket.on('messageLog', data => {
    // console.log('mensajes del server: ', data)
    let log = document.querySelector('#messageLog')
    
    let messages = ''
    data.forEach(message => {
        messages += `<li>${message.user} - dice: ${message.message}<br></li>`
    })
    log.innerHTML = messages
})
