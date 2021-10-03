import Fastify from 'fastify';
import path from 'path';
import telegrafPlugin from 'fastify-telegraf';
import router from './router';
import auth from './middleware/auth';
import { bot, SECRET_PATH } from './bot';

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

const fastify = Fastify({
    logger: false
})

fastify.addHook('onRequest', auth);
fastify.register(telegrafPlugin, { bot, path: SECRET_PATH })
fastify.register(router);

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '../', 'public'),
});



const start = async () => {
    try {
        await fastify.listen(PORT, '0.0.0.0', (err, address) => {
            console.log(`\n\nServer listening on ${address}\n\n`)
        })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
