import Fastify from 'fastify';

import router from './router'
import DB from './db';
import { removeUrlPathPrefix } from './utils'

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
 * */

const PORT = 3000


const fastify = Fastify({
    logger: true
})

fastify.addHook('onRequest', (request, reply, done) => {

    const { headers, url } = request;
    
    const partURL = url.split('/')[1];

    // проверяем токен для всех запросов связанных с БД
    if (partURL === 'db') {

        const { authorization } = headers;

        if (!authorization) {
            throw new Error('authorization token is missing')
        }

        const token = authorization.split(' ')[1];
        const dataPath = `/tokenRights/${token}`;

        let availablePaths = []

        try {
            availablePaths = DB.get(dataPath);
        } catch (e) {
            throw new Error(`token [${token}] not found`);
        }

        let isAvailable = false;

        const cleanUrl = removeUrlPathPrefix(url)

        availablePaths.forEach((path) => {
            if (cleanUrl.includes(path)) {
                isAvailable = true;
            }
        });

        if (!isAvailable) {
            throw new Error(`token [${token}] dont have permissen for path [${cleanUrl}], but have for [${availablePaths}]`)
        }

        console.log('\n\n', 'Token: [', token, ']\n\n', 'AvailablePaths: ', availablePaths, '\n\n', isAvailable, '\n\n');
    }

    done()
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
