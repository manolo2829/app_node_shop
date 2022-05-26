
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const cookieParser = require('cookie-parser')


app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(expressLayouts)

// PARA PODER TRABAJAR CON LOS COOKIES
app.use(cookieParser())

// llamamos al router
app.use('/', require('./routes/router.js'))


app.listen(3000, () => {
    console.log('Server UP en http://localhost:3000')
})