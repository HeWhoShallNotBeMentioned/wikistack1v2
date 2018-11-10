const express = require('express');
const router = express.Router();

const { Page } = require('../models');
const { addPage, wikiPage, main } = require('../views');

router.get('/', async (req, res, next) => {
  const pages = await Page.findAll();
  res.send(main(pages));
});

router.post('/', async (req, res, next) => {
  const page = new Page({
    title: req.body.title,
    content: req.body.content,
  });
  //console.log('new page in wiki router ', page);
  try {
    await page.save();
    //console.log('new page ', page);
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
});

router.get('/add', (req, res, next) => {
  res.send(addPage());
});

router.get('/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug,
      },
    });
    //console.log('page ', page);
    res.send(wikiPage(page));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
