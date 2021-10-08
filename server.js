const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const Article = require('./models/article');
const articleRouter = require('./routes/articles');

mongoose.connect('mongodb+srv://user123:test987@cluster0.lodca.mongodb.net/markdown-blog?retryWrites=true&w=majority', { useNewURLParser: true, useUnifiedTopology: true })

// deleted middle comment, added new comment

let blog = [];
Article.find()
  .then(res => {
    blog = res;
    console.log(res, blog, 'hello')
  })
  .catch(err => {
    console.log(err)
  })
app.listen(5000);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 });
  res.render('articles/index', { articles });
})

app.use('/articles', articleRouter);

// new change