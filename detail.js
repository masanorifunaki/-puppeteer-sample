'use strict';

const puppeteer = require('puppeteer');
const stringify  = require('csv-stringify');
const iconv     = require('iconv-lite');
const fs        = require('fs');
const path      = require('path');
const delay     = require('delay');

const getInfoFromChildPage = async (browser, url) => {
  const chilePage = await browser.newPage();
  await chilePage.goto(url);
  const h1Title = await chilePage.evaluate(() =>
    document.querySelector('h1.syoseki').textContent);
  const result = await chilePage.evaluate(() =>
    Array.from(document.querySelectorAll('.norm td')).map(td => td.textContent));
  await chilePage.close();
  result.unshift(h1Title);
  return result;
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
  await page.goto('https://www.shuwasystem.co.jp/newbook.html');

 // 新刊案内の各ページへのリンク先を取得
  const results = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#sinkan dt a'))
      .map(a => a.href));

  // それぞれの新刊の詳細情報ページの情報を取得する
  const csvData = [];
  for (const result of results) {
    await delay(1000); // スクレイピングする際にはアクセス間隔を1秒あける
    console.log(result);
    const texts = await getInfoFromChildPage(browser, result);
    csvData.push(texts)
  }

  // ここからはCSVに出力するためだめの処理
  // csvData を文字列化する
  stringify(csvData, (error, csvString) => {
    // ファイルシステムに対してファイル名を指定し、ファイルストリームを生成する
    const writableStream = fs.createWriteStream(path.join(__dirname, 'shuwasystem.csv'));
    writableStream.write(iconv.encode(csvString, 'UTF-8'));
  });

  console.log('----------------------close');
  await browser.close();
})();