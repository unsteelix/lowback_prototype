import Fastify from 'fastify';
import path from 'path';
import router from './router';
import auth from './middleware/auth';

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


const fastify = Fastify({
    logger: true
})

fastify.addHook('onRequest', auth);
fastify.register(router);

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '../', 'public'),
});

console.log('\n\n',__dirname,'\n\n')



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
