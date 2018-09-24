'use strict';

const puppeteer = require('puppeteer');
const path      = require('path');
const converter = require('convert-filename-ja');
const delay     = require('delay');

const createPdfWithChildPage = async (browser, url) => {
  // 新しいタブをひらく.
  const chilePage = await browser.newPage();
  // 各ニュース記事のurlへ遷移.
  await chilePage.goto(url);
  // [続きを読む] リンクをクリックして、詳細なページを表示する.
  await Promise.all([
    chilePage.waitForNavigation({ waitUntil: 'load' }),
    chilePage.click('a.newsLink'),
  ]);
  // ファイル名を記事のタイトルとする.
  const titleText = await chilePage.evaluate(() => document.querySelector('h1').textContent.trim());
  const filePath  = path.join(__dirname, converter.convert(titleText));
  // 保存.
  await chilePage.pdf({ path: `${filePath}.pdf`, format: 'A4' });
  // 閉じる.
  await chilePage.close();
};

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
  console.log('----------------------goto');
  await page.goto('https://www.yahoo.co.jp/');

  // 表示している各ニュースのリンク先一覧を取得.
  const results = await page.evaluate(() => Array.from(document.querySelectorAll('#topicsfb .topicsindex ul.emphasis a')).map(a => a.href));

  // それぞれのニュースのページを開く.
  for (const result of results) {
    await delay(1000); // スクレイピングする際にはアクセス間隔を1秒あける.
    console.log(`取得処理開始 ${result}`);
    await createPdfWithChildPage(browser, result)
      .then(() => {
        console.log('成功');
      }).catch((error) => {
        console.log(`次のurlの取得処理は失敗しました ${result}`);
        console.log(error);
      });
  }

  console.log('----------------------close');
  await browser.close();
})();