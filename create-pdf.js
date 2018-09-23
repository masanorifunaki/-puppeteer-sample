'use strict';

const puppeteer = require('puppeteer');
const path      = require('path');
const delay     = require('delay');

/**
 *  メインロジック
 */

(async () => {

  // Puppeteer の起動
  const browser = await puppeteer.launch({
    args: ['--lang=ja'],
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
  console.log('----------------------goto');
  await page.goto('https://www.nikkei.com/');

  await delay(1000); // スクレイピングする際にはアクセス間隔を1秒あける

  console.log('----------------------click');
  await page.screenshot({
    path: path.join(__dirname, '001-before.png')
  });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    page.click('.m-miM07_title a'),
  ]);

  await delay(1000); // スクレイピングする際にはアクセス間隔を1秒あける

  console.log('----------------------emulate');
  await page.emulateMedia('screen');
  await page.screenshot({
    path: path.join(__dirname, '002-screen.png')
  });

  console.log('----------------------emulate');
  await page.emulateMedia('print');
  await page.screenshot({
    path: path.join(__dirname, '003-print.png')
  });

  console.log('----------------------pdf');
  await page.pdf({
    path: path.join(__dirname, 'nikkei-top.pdf'),
    format: 'A4',
  });
  await page.screenshot({
    path: path.join(__dirname, '004-after.png')
  });

  // ブラウザの終了
  console.log('----------------------close');
  await browser.close();
})().catch((e) => {
  console.log(e);
});