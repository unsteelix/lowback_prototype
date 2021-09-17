import Fastify from 'fastify';
import JMESPath from 'jmespath';

import router from './router'
import DB from './db';


/**
 * [GET]  /auth/unsteelix/12345678                   - запрос на получение токена аутентификации
 * [GET]  /db/site/...                               - запрос на получение данных
 * [GET]  /db/query/site/gallery/card[id=10]         - запрос по правилу
 * [POST] /db/set                                    - запрос на вставку с заменой
 * [POST] /db/merge                                  - запрос на изменение (добавление без удаления существующего)
 * [POST] /db/push                                   - запрос на добавление в массив
 * [POST] /db/delete                                 - Запрос на удаление
 * 
 * [GET]  /                                          - основная страница со стенографической картикой и формой входа
 * [GET]  /admin/adminpass                           - админка
 * 
 * */

const PORT = 3000


const fastify = Fastify({
    logger: true
})

fastify.register(router)

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



/*
router
    .get('/', (ctx) => {
        const data = DB.get('/');
        console.log('\n\nGET\n\n', data, 'Welcome !!!');
    })
    .get('/db/query/(.*)', (ctx) => {
        const { url } = ctx.request;
        const query = url.slice(10);

        // чистим запрос и переводим в нужный синтаксис
        let cleanQuery = query.trim();
        const lastSymbol = cleanQuery.slice(-1);

        // убираем последний "/", если таковой присутствует
        if (lastSymbol === '/') {
            cleanQuery = cleanQuery.slice(0, -2);
        }

        // заменяем слэши на точки
        cleanQuery = cleanQuery.replaceAll('/', '.');

        const data = DB.get('/');
        
        const res = JMESPath.search(data, cleanQuery);
        ctx.body = res;
    })
    .post('/db/set/(.*)', (ctx) => {
        const { url } = ctx.request;
        const dataPath = url.slice(7);

        const post = ctx.request.body;

        const res = DB.set(dataPath, post);
        ctx.body = res;
    })

    .post('/db/merge/(.*)', (ctx) => {
        const { url } = ctx.request;
        const dataPath = url.slice(9);

        const post = ctx.request.body;

        const res = DB.merge(dataPath, post, false);
        ctx.body = res;
    })

    .get('/db/delete/(.*)', (ctx) => {
        const { url } = ctx.request;
        const dataPath = url.slice(10);

        DB.delete(dataPath);
        ctx.body = 'successfully deleted';
    })

    .get('/db/reload', (ctx) => {
        DB.reload();
        ctx.body = 'successfully reload';
    })

    .get('/auth/:login/:pass', (ctx) => {
        const { login, pass } = ctx.params;
        const token = DB.get(`/token/${login}/${pass}`);
        ctx.body = token;
    })

    .get('/', (ctx) => {

    })

    .get('/db/(.*)', (ctx) => {
        const { url } = ctx.request;
        const dataPath = url.slice(3);
        const data = DB.get(dataPath);
        ctx.body = data;
    })

app.use(router.routes());

app.on('error', err => {
    console.error('server error', err);
});

app.listen(4000);
console.log('Server is running on port 4000');
*/