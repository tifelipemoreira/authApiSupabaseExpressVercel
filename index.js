const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger.json')
const app = require('./src/config/express')
require('dotenv/config');

const port = process.env.PORT || 3000 

const users = require('./src/api/users')
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.get('/getuserbyid', users.getUsers)
app.post('/createuser', users.CreateUser)
app.post('/oauth2',users.oauth2)
app.listen(port)