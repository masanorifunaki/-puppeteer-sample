const puppeteer = require('puppeteer');
const stringify = require('csv-stringify');
const iconv     = require('iconv-lite');
const fs        = require('fs');
const path      = require('path');
const delay     = require('delay');

const getInfoFromChildPage = async (browser, url) => {
  const childPage = await browser.newPage();
  await childPage.goto(url);
  const h1Title = await childPage.evaluate(() => document.querySelector('h1.syoseki').textContent);
  const result  = await childPage.evaluate(() => Array.from(document.querySelectorAll('.norm td')).map(td => td.textContent));
  await childPage.close();
  result.unshift(h1Title);
  return result;
};

/**
 * メインロジック.
 */

(async () => {
  // Puppeteerの起動.
  const browser = await puppeteer.launch({
    headless: true, // Headlessモードで起動するかどうか.
    slowMo  : 50, // 指定のミリ秒スローモーションで実行する.
  });

  // 新しい空のページを開く.
  const page = await browser.newPage();

  // view portの設定.
  await page.setViewport({width: 1200, height: 800});

  // 一覧ページである 新刊案内 ページを開く.
  await page.goto('http://www.shuwasystem.co.jp/newbook.html');

  const results = await page.evaluate(() => Array.from(document.querySelectorAll('#sinkan dt a')).map(a => a.href));

  const csvData = [];

  for (const result of results) {
    await delay(1000); // スクレイピングする際にはアクセス間隔を1秒あける.
    // console.log(result);
    const texts = await getInfoFromChildPage(browser, result);
    csvData.push(texts);
  }

  stringify(csvData, (error, csvString) => {
    const writebleStrem = fs.createWriteStream(path.join(__dirname, 'sample.csv'));
    writebleStrem.write(iconv.encode(csvString, 'utf-8'));
  });

  await browser.close();

})();