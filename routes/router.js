const express = require('express')
const router = express.Router()


const authController = require('../controllers/authController.js')


// router para las vistas
router.get('/', (req, res) => {
    res.render('inicio', {
        user:req.user,
        alert:false
    })
})

router.get('/productos',authController.isAuthenticated, (req, res) => {
    res.render('productos', {
        user:req.user,
        alert:false
    })
})

router.get('/signup', (req, res) => {
    res.render('signup', {alert:false})
})

router.get('/signin', (req, res) => {
    res.render('signin', {alert:false})
})

// router para los metodos del controller
router.post('/signup', authController.signup)
router.post('/signin', authController.signin)


module.exports = router