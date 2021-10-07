const express = require('express');
const router = express.Router();
const Article = require('../models/article');

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/:slug', async (req, res) => {
  let article = await Article.findOne({ slug: req.params.slug });
  res.render('articles/show', { article, fav: false });  
  article.views++;
  try {
    await article.save();
  } catch(err) {
    console.log(err)
  }           
})

router.get('/edit/:id', (req, res) => {
  Article.findById(req.params.id)
    .then(result => {
      res.render('articles/edit', { article: result })
    })
})

router.post('/', async (req, res, next) => {
  req.article = new Article({ views: 0, likes: 0 });
  next();
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id);
  next();
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect('/');
})

router.put('/:id/fav', async (req, res) => {
  const article = await Article.findById(req.params.id);
  article.likes++;
  try {
    await article.save();
    res.render('articles/show', { article });
  } catch(err) {
    console.log(err)
    res.render('articles/show', { article });
  }
})

router.put('/:id/unfav', async (req, res) => {
  const article = await Article.findById(req.params.id);
  article.likes--;
  try {
    await article.save();
    res.render('articles/show', { article });
  } catch(err) {
    console.log(err)
    res.render('articles/show', { article });
  }
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    console.log(article)
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch(err) {
      console.log(err)
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router;