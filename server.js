const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const Article = require('./models/article');
const articleRouter = require('./routes/articles');

const mongoURI = require('./config/keys.js').mongoURI;
mongoose.connect(mongoURI, {
  useNewURLParser: true, 
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.listen(5000);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 });
  res.render('articles/index', { articles });
})

app.use('/articles', articleRouter);