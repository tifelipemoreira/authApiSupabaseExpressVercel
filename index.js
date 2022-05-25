const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger.json')
const app = require('./src/config/express')
const tokenLogin = require('./src/middleware/tokenLogin')
require('dotenv/config');

const port = process.env.PORT || 3000 

const users = require('./src/api/users')
app.get('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.get('/getusers',tokenLogin, users.getUsers)
app.post('/createuser',tokenLogin, users.createUser)
app.post('/oauth2',users.oauth2)
app.patch('/resetpassword',tokenLogin,users.resetPassword)
app.listen(port)