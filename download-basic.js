

const puppeteer = require('puppeteer');
const fs        = require('fs');
const path      = require('path');

/**
 *  メインロジック
 */

(async () => {
  'use strict';
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
  await page.goto('https://www.google.co.jp/');

  // img タグの取得
  // （取得した要素は ElementHandle というオブジェクトで取得できる）
  const image = await page.$('#lga img');

  // 結果の出力
  // console.log(image);

  // 取得したタグの src 属性を取得する
  // （取得した要素は JSHandle というオブジェクトで取得できる）
  const src = await image.getProperty('src');
  // console.log(src);

  // JSHandle オブジェクトの内容を jsonValue で取り出す
  // （この場合は文字列が src に指定している url を取得できる）
  const targetUrl = await src.jsonValue();
  console.log(`targetUrl=${targetUrl}`);

  // URL で形式で取得できたパスのファイル名部分を取り出す
  const filename = targetUrl.split('/').pop();
  console.log(`filename=${filename}`);

  const localFileFullPath = path.join(__dirname, filename);
  console.log(`localfilename=${localFileFullPath}`);

  const viewSource = await page.goto(targetUrl);
  fs.writeFile(localFileFullPath, await viewSource.buffer(), (error) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log('The file was saved!');
  });
  // ブラウザの終了
  await browser.close();
})();