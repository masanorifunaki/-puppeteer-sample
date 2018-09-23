'use strict';

const puppeteer = require('puppeteer');

/**
 *  メインロジック
 */

(async () => {

  // Puppeteer の起動
  const browser = await puppeteer.launch({
    headless: true,
    slowMo  : 50,
  });

  // 新しい空のページを開く
  const page = await browser.newPage();

  // view port の設定
  await page.setViewport({
    width : 1200,
    height: 800,
  });

  // 該当ページへ遷移する
  await page.goto('https://www.shuwasystem.co.jp/');

  await page.screenshot({
    path: 'fullPage.png',
    fullPage: true
  });

  await browser.close();
})();