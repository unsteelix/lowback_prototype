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
 * 
 * !!!!!!! узнать склько раз вызывается подключение к БД
 * !!!!!!! посмотреть структуру JWT и сделать генерируемые временные токены
 * 
 * */

const PORT = 3000

const BOT_TOKEN = '2029552408:AAGDRZEx0YXyT2j7tkISeSIEeysZKmKcLj8'
const WEBHOOK_URL = 'https://lowback.ru/telega'

const fastify = Fastify({
    logger: true
})







if (!WEBHOOK_URL) throw new Error('"WEBHOOK_URL" env var is required!')
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!')

const bot = new Telegraf(BOT_TOKEN)

const SECRET_PATH = `/telegraf/${bot.secretPathComponent()}`

console.log('\n\n',SECRET_PATH,'\n\n')

fastify.register(telegrafPlugin, { bot, path: SECRET_PATH })

bot.on('text', (ctx) => {

    const text = ctx.update.message.text;
    const data = db.get('/pass')

    const res = data.split('\n\n');
    let found = '';

    console.log('\n\n',text,'\n\n')


    res.forEach(el => {
        console.log('\n\n',el,'\n\n')

        if(el.includes(text)){
            console.log(444)
            found = found + '\n\n' + el
        }
    });  
    
    found ? ctx.reply(found) : ctx.reply('Nothing')

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
