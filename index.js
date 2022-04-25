const app = require('./src/config/express')

const port = process.env.PORT || 4000 

const users = require('./src/api/users')
app.get('/userbyid', users.getUsersbyId)
app.get('/userbyemail', users.getUsersbyEmail)
app.get('/getUserBd', users.getUserBd)
app.listen(port)