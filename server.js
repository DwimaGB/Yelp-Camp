const express = require('express')
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.listen(process.env.PORT || 3000);