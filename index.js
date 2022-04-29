const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger.json')
const app = require('./src/config/express')

const port = process.env.PORT || 4000 

const users = require('./src/api/users')
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.get('/userbyemail', users.getUsersbyEmail)
app.get('/getuserbyid', users.getUserById)
app.post('/createuser', users.postCreateUser)
app.listen(port)