const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');


const token = '6209650789:AAHEeTG3UtoLooHdWqCNgFGDeEkWROeV9fA';
const webAppUrl = 'https://shadow123312123.github.io/barbarusbrewery/';

const bot = new TelegramBot(token, {polling: true});
const app =express();

app.use(express.json());
app.use(cors());



bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId, 'Кнопка', {
            reply_markup: {
                keyboard: [
                    [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)

            bot.sendMessage(chatId, 'Заказ: ')
        } catch (e) {
            console.log(e);
        }

    }
});

app.post('/web-data', async (req, res) => {
    const {queryId, products, totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title : 'Успешная покупка!',
            input_message_content: {message_text: 'Итого: ' + totalPrice}
        })
        return res.status(200).json({});
    } catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title : 'Не удалось приобрести товар',
            input_message_content: {message_text: 'Не удалось приобрести товар'}
        })
        return res.status(500).json({});
    }

})


const PORT = 8000
app.listen(PORT, () => console.log('server started on PORT ' + PORT))