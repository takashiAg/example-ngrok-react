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