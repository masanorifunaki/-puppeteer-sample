// dotenv を require すると同時に config() を呼び出し、実行時の環境変数に .env の設定内容をセットする
require('dotenv').config();

const USER_ID = process.env.MY_USER_ID;
console.log(USER_ID);