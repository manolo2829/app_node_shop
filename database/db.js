
const mysql = require('mysql')

// hacemos la conexion con las variables de entorno
const conexion = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'database_shop',
})

conexion.connect( (error) =>{
    if(error){
        console.log('El error de cnexion es: '+error)
        return;
    }
    console.log('¡Conectado a la base de datos MYSQL!')
})

module.exports = conexion