'use strict';

const puppeteer = require('puppeteer');

(async () => {

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
  });

  const page = await browser.newPage();

  await page.setViewport({
    width : 1200,
    height: 800
  });

  await page.goto('http://kinnikubaka.com/news/');

  await page.waitForSelector('.entry');

  const posts = await page.evaluate((selector) => {
    document.querySelector(selector).remove();
    return document.querySelectorAll(selector);
  }, '.entry');

  console.log(posts);

  await browser.close();

})();

