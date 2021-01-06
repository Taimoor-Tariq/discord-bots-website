require('dotenv-flow').config();
const
    express = require('express'),
    app = express(),
    port = process.env.PORT || 3000

app.use(require('express-session')({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: true
    }))
    .use(express.urlencoded( {extended: true} ))
    .use(require('body-parser').json())
    .use(express.static("public"))
    .use(require('./routes'))

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})