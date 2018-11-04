const puppeteer = require('puppeteer');
const _         = require('lodash');

/**
 * メインロジック.
 */

(async () => {
// Puppeteerの起動.
  const browser = await puppeteer.launch({
    headless: false, // Headlessモードで起動するかどうか.
    slowMo  : 50, // 指定のミリ秒スローモーションで実行する.
  });

  // 新しい空のページを開く.
  const page = await browser.newPage();

  // view portの設定.
  await page.setViewport({
    width : 1200,
    height: 800,
  });

  // 秀和システムのトップページへ遷移.
  await page.goto('http://www.shuwasystem.co.jp/');

  const newBookImages = await page.$$('#newbook img');

  _.each(newBookImages, async (img) => {
    const prop = await img.getProperty('src');
    // JSHandleオブジェクトの内容をjsonValueで取り出す. (この場合は文字列がsrcに指定しているurlを取得できる.)
    const src  = await prop.jsonValue();
    console.log(src);
  });
})();