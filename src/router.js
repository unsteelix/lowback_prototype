import JMESPath from 'jmespath';
import DB from './db';

const router = async (fastify) => {
    /**
     * Не работают пути ( /fsdf/3334 ) с ключами начинающимися с типа Number, например 
     * {
     *    33r: "test"
     * }
     */
    fastify.get('/db/query/*', (request) => {
        const { params } = request;
        const query = params['*'];

        // чистим запрос и переводим в нужный синтаксис
        let cleanQuery = query.trim();
        const lastSymbol = cleanQuery.slice(-1);

        // убираем последний "/", если таковой присутствует
        if (lastSymbol === '/') {
            cleanQuery = cleanQuery.slice(0, -1);
        }

        // заменяем слэши на точки
        cleanQuery = cleanQuery.replaceAll('/', '.');

        const data = DB.get('/');

        return JMESPath.search(data, cleanQuery);
    })

    fastify.post('/db/set/*', (request) => {
        const { params } = request;
        const dataPath = `/${params['*']}`;

        const post = request.body;

        return DB.set(dataPath, post);
    })

    fastify.post('/db/merge/*', (request) => {
        const { params } = request;
        const dataPath = `/${params['*']}`;
        const post = request.body;

        return DB.merge(dataPath, post);
    })

    fastify.get('/db/delete/*', (request) => {
        const { params } = request;
        const dataPath = `/${params['*']}`;

        DB.delete(dataPath);
        return 'successfully deleted';
    })

    fastify.get('/db/reload', () => {
        DB.reload();
        return 'successfully reload';
    })

    fastify.get('/db/*', (request) => {
        const { params } = request;
        const dataPath = `/${params['*']}`;

        return DB.get(dataPath);
    })

    fastify.get('/auth/:site/:pass', async (request) => {
        const { params } = request;
        const { site, pass } = params;

        if (!site || !pass) {
            throw new Error('password must be NOT VOID');
        }

        const dataPath = `/auth/${site}/${pass}`;

        return DB.get(dataPath);
    })

    fastify.get('/', (req, reply) => reply.sendFile('auth.html'))

    fastify.get('/docs', (req, reply) => reply.sendFile('docs.html'))

    fastify.get('/admin', (req, reply) => reply.sendFile('admin.html'))

    fastify.get('/pass/:token', (req, reply) => reply.sendFile('pass.html'))
    
}

export default router
