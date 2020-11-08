# コンセプト
yarn startし他時に他の人にも簡単に共有できたらいいな。
ついでにslackとかに自動で共有されたら、いいな
ついでに勤怠管理もできそう。

# とりあえず実行
```
git clone https://github.com/takashiAg/example-ngrok-react
cd example-ngrok-react
yarn install
yarn start
## ↑これで普通のreactが立ち上がります。
yarn ngrok
## ↑これでngrokが立ち上がり、自動でslackに投稿します。
```
## 自分のプロジェクトにインストール
### まずは依存パッケージのインストール
```
# cd /path/to/your/project
yarn install dotenv axios ngrok forever
```

### 直下に、ngrok.jsと言うファイルを用意する
```js:ngrock.js
const ngrok = require('ngrok');
const axios = require('axios');
require('dotenv').config();

const URL = process.env.URL_SLACKAPI || "";
const USER = process.env.USERNAME || "";
const PORT = process.env.PORT || 3000;


const main = async () => {
    if (!URL) {
        console.log("set URL_SLACKAPI to .env");
        return
    }
    if (!USER) {
        console.log("set USER to .env");
        return
    }

    try {
        const ngrokURL = await ngrok.connect(
            {
                proto: 'http',
                addr: PORT,
                region: 'jp',
            }
        );
        console.log(`ngrok proxy has started!\n\tURL\t:\t${ngrokURL}`)

        const { data: data, ...others } = await axios.post(URL, { ngrokURL, USER })
        console.log(data)

    } catch (e) {
        console.log(e)
    }
}

main()
```

### package.jsonにスクリプトを追加
```json:package.json
{
  "scripts": {
    // 省略
    "ngrok": "node ngrok",
    // 省略
  }
}
```

### 実行
```
yarn ngrok
```

### reactの時はこれで、reactとngrokが同時に実行されます
```
const ngrok = require('ngrok');
const axios = require('axios');
require('dotenv').config();
require("./node_modules/react-scripts/scripts/start");

const URL = process.env.URL_SLACKAPI || "";
const USER = process.env.USERNAME || "";
const PORT = process.env.PORT || 3000;


const main = async () => {
    if (!URL) {
        console.log("set URL_SLACKAPI to .env");
        return
    }
    if (!USER) {
        console.log("set USER to .env");
        return
    }

    try {
        const ngrokURL = await ngrok.connect(
            {
                proto: 'http',
                addr: PORT,
                region: 'jp',
            }
        );
        console.log(`ngrok proxy has started!\n\tURL\t:\t${ngrokURL}`)

        const { data: data, ...others } = await axios.post(URL, { ngrokURL, USER })
        console.log(data)

    } catch (e) {
        console.log(e)
    }
}

main()
```