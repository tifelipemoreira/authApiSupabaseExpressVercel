const app = require('./src/config/express')

const port = process.env.PORT || 4000 

const user = require('./src/api/users')
app.get('/users', users.users)
app.get('/users2', users.users2)

app.listen(port)