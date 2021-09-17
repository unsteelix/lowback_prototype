import DB from './db';
import JMESPath from 'jmespath';



const router = async (fastify) => {

    fastify.get('/', async () => {
        return DB.get('/');
    })

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

    fastify.get('/db/reload', async () => {
        DB.reload();
        return 'successfully reload';
    })

    fastify.get('/auth/:login/:pass', async (request) => {
        const { params } = request;
        const { login, pass } = params;

        return DB.get(`/token/${login}/${pass}`);
    })

    fastify.get('/db/*', async (request) => {
        const { params } = request;
        const dataPath = `/${params['*']}`;

        return DB.get(dataPath);
    })

}

export default router
