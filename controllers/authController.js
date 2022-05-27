const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db.js')
// LE INDICAMOS A NODE QUE VAMOS A UTILIZAR PROMESAS
const {promisify} = require('util')

// procedimiento para registrarnos
exports.signup = async(req, res) => {
    try{
        console.log(req)
        const email = req.body.email
        const name = req.body.name
        const username = req.body.username
        const pass = req.body.pass
        // encriptamos la contraseña con el metodo hash
        let passHash = await bcryptjs.hash(pass, 8)
        // console.log(passHash)
        conexion.query('INSERT INTO users SET ?', {email: email, name: name, username: username, password:passHash}, (error, results) => {
            if(error){console.log(error)}
            res.json('usuario creado')
        })
    }catch (error) {
        res.json({
            "error": error.message
        })
    }
}

// procedimineto para login
exports.signin = async(req, res) => {
    try {
        console.log('hola')
        const email = req.body.email
        const pass = req.body.pass
        console.log(email+' - '+pass)

        if(!email || !pass){
            res.json('complete los datos')
        }else{
            conexion.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
                if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].password))){
                    res.json('datos incorrectos')
                    console.log(error)
                }else{
                    // incio de sision ok
                    const id = results[0].id
                    
                    // le pasamos la clave secreta
                    const token = jwt.sign({id:id}, 'super_secreto', {
                        expiresIn: '7d'
                    })

                    console.log('TOKEN: '+ token + ' para el usuario: '+ email)

                    const cookiesOptions = {
                        expires: new Date(Date.now()+ 90 * 24 * 60 * 60 * 1000 ),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    res.json('login completo')
                }
            })
        }
    } catch (error) {
        res.json({
            "error" : error.message
        })
    }
}

// methodo para verificar si el usuario esta authenticado
exports.isAuthenticated = async(req, res, next) => {
    // condicional que pregunta si esta nuestra cookie llamada jwt
    if (req.cookies.jwt) {
        try {
            // dcodificamos la cookie
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results)=> {
                // lo que estamos haciendo en este condicional es que en el caso de que los resultados no tengan ningun valor
                if(!results){return next()}
                req.user = results[0]
                // next pasa a ejecutar el siguiente midlewear
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')

    }
}

// procedimiento de cerrar sesion

exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}