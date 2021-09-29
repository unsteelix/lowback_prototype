import DB from '../db';
import { removeUrlPathPrefix, getCookie } from '../utils';

const auth = (request, reply, done) => {

    const { headers, url } = request;
    
    // удаляем слэш в конце
    let urlWithoutSlash = url;
    if (url.length > 4 && url[url.length - 1] === '/') {
        urlWithoutSlash = url.slice(0, url.length - 1);
    }

    // первая часть URL
    const partURL = urlWithoutSlash.split('/')[1];

    /**
     *  для всех запросов связанных с БД или админкой
     *  проверяем наличие токена в заголовках
     */
    if (partURL === 'db' || partURL === 'admin' || partURL === 'docs') {

        let token = null;

        /**
         * для токенов в Authorization
         */
        if (partURL === 'db') {
            const { authorization } = headers;

            if (!authorization) {
                throw new Error('authorization token is missing')
            }

            token = authorization.split(' ')[1];

        /**
         * для токенов в куках
         */
        } else if (partURL === 'admin' || partURL === 'docs') {

            const { cookie } = headers;

            if (!cookie) {
                throw new Error('authorization cookie is missing')
            }

            token = getCookie(cookie, 'token')
            
            if (!token) {
                throw new Error('token in cookie not found')
            }
        }

        if(!token){
            throw new Error('Token must be not void')
        }

        let availablePaths = []

        /**
         * разрешаем для генерируемых токенов запросы в ветку с паролями /pass
         */
        if (url.includes(`/db/set/pass/${token}`) || url.includes(`/db/pass/${token}`)) {

            availablePaths.push(`/pass/${token}`)

        } else { // для обычных токенов

            const dataPath = `/tokenRights/${token}`;

            try {
                availablePaths = DB.get(dataPath);
            } catch (e) {
                throw new Error(`token [${token}] not found`);
            }

        }

        let isAvailable = false;

        const cleanUrl = removeUrlPathPrefix(urlWithoutSlash)

        availablePaths.forEach((path) => {
            if (cleanUrl.includes(path)) {
                isAvailable = true;
            }
        });

        if (!isAvailable) {
            throw new Error(`token [${token}] dont have permission for path [${cleanUrl}], but have for [${availablePaths}]`)
        }

        console.log('\n\n', 'Token: [', token, ']\n\n', 'AvailablePaths: ', availablePaths, '\n\n', isAvailable, '\n\n');
    }

    done()
}

export default auth;
