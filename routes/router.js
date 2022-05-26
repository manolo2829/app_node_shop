const express = require('express')
const router = express.Router()


const authController = require('../controllers/authController.js')


// router para las vistas
router.get('/', (req, res) => {
    res.render('inicio')
})

router.get('/productos', (req, res) => {
    res.render('productos')
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.get('/signin', (req, res) => {
    res.render('signin')
})

// router para los metodos del controller
router.post('/signup', authController.signup)
router.post('/signin', authController.signin)


module.exports = router