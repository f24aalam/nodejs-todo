const express = require('express')
const cors = require('cors')

const app = express()

var corsOptions = {
    origin: "http://localhost:8080"
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const db = require("./app/models")
const dbConfig = require('./app/config/db.config')
const Role = db.role

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connected to the database");
        initial();
    })
    .catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });

app.get("/", (req, res) => {
    res.json({message: "Welcome to NodeJS Todo App"})
})

require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err)
                }
                console.log("added 'user' to roles collection")
            })

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err)
                }
                console.log("added 'admin' to roles collection")
            })
        }
    })
}