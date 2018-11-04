const puppeteer = require('puppeteer');
const fs        = require('fs');
const path      = require('path');

/**
 * メインロジック.
 */

(async () => {
  // Puppeteerの起動.
  const browser = await puppeteer.launch({
    headless: false, // Headlessモードで起動するかどうか.
    slowMo  : 50, // 指定のミリ秒スローモーションで実行する
  });

  // 新しい空のページを開く.
  const page = await browser.newPage();

  // view portの設定.
  await page.setViewport({
    width : 1200,
    height: 800,
  });

  // 該当ページへ遷移する.
  await page.goto('https://www.google.co.jp/');

  const image     = await page.$('#lga img');
  const src       = await image.getProperty('src');
  const targetUrl = await src.jsonValue();
  console.log(`targetUrl=${targetUrl}`);

  const fileName = targetUrl.split('/').pop();
  console.log(`fileName=${fileName}`);

  const localFileFullPath = path.join(__dirname, fileName);
  console.log(`localFileFullPath=${localFileFullPath}`);

  const viewSource = await page.goto(targetUrl);
  fs.writeFile(localFileFullPath, await viewSource.buffer(), (error) => {
    if (error) {
      return;
    }
    console.log('The file was saved!');
  });

  await browser.close();
})();