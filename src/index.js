import Fastify from 'fastify';
import path from 'path';
import {Telegraf} from 'telegraf';
import telegrafPlugin from 'fastify-telegraf';
import router from './router';
import auth from './middleware/auth';
import db from './db';

/**
 * [GET]  [S] /db/site/...                               - запрос на получение данных
 * [GET]  [S] /db/query/site/gallery/card[id=10]         - запрос по правилу
 * [POST] [S] /db/set                                    - запрос на вставку с заменой
 * [POST] [S] /db/merge                                  - запрос на изменение (добавление без удаления существующего)
 * [POST] [S] /db/push                                   - запрос на добавление в массив
 * [POST] [S] /db/delete                                 - запрос на удаление
 * 
 * [GET]  /auth/:site/:pass                              - запрос на получение токена и доступных роутов
 * 
 * [GET]  /                                              - основная страница со стенографической картикой и формой входа
 * [GET] [S] /admin                                      - админка
 * [GET] [S] /docs                                       - документация
 * [GET]  /pass/dddddddddd                               - редактор паролей
 * [GET]  /pass/wwwwwwwwww                               - редактор паролей
 * 
 * !!!!!!! узнать склько раз вызывается подключение к БД
 * !!!!!!! посмотреть структуру JWT и сделать генерируемые временные токены
 * 
 * */

const PORT = 3200

const BOT_TOKEN = '2029552408:AAGDRZEx0YXyT2j7tkISeSIEeysZKmKcLj8'
const WEBHOOK_URL = 'https://lowback.ru/telega'

const fastify = Fastify({
    logger: false
})







if (!WEBHOOK_URL) throw new Error('"WEBHOOK_URL" env var is required!')
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!')

const bot = new Telegraf(BOT_TOKEN)

const SECRET_PATH = `/telegraf/${bot.secretPathComponent()}`

console.log('\n\n',SECRET_PATH,'\n\n')

fastify.register(telegrafPlugin, { bot, path: SECRET_PATH })

bot.on('text', (ctx) => {
console.log(111111111111)
    // сообщение
    const { message } = ctx.update;
    
    // пользователь
    const user = ctx.update.message.from;

    // текст сообщения
    const { text } = message;

    // все данные и whitelist пользователей бота)
    const { pass, botUserWhiteList } = db.get('/')

    if (!botUserWhiteList.includes(user.id)) {
        ctx.reply('Тебе сюда нельзя! Дружок пирожок')
        return;
    }

    // для возврата всех данных
    if (text.toLowerCase() === 'all') {
        ctx.reply(pass);
        return;
    }

    // для возврата других данных из БД
    if (text[0] === '/') {
        ctx.reply(db.get(text));
        return;
    }

    const splittedPass = pass.split('\n\n');
    
    let suitablePass = '';

    splittedPass.forEach(el => {
        if (el.toLowerCase().includes(text.toLowerCase())) {
            suitablePass += `${el}\n\n`
        }
    });  
    
    suitablePass ? ctx.reply(suitablePass) : ctx.reply('Nothing')
    return;
})

bot.launch()
/*
bot.telegram.setWebhook(WEBHOOK_URL + SECRET_PATH).then(() => {
  console.log('Webhook is set on', WEBHOOK_URL)
})
*/








fastify.addHook('onRequest', auth);
fastify.register(router);

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '../', 'public'),
});



const start = async () => {
    try {
        await fastify.listen(PORT)
        console.log(`Server is now listening on port ${PORT}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
