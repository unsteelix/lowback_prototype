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

    // проверяем токен для всех запросов связанных с БД или админкой
    if (partURL === 'db' || partURL === 'admin') {

        let token = null;

        // для токена в заголовке Authorization
        if (partURL === 'db') {
            const { authorization } = headers;

            if (!authorization) {
                throw new Error('authorization token is missing')
            }
    
            token = authorization.split(' ')[1];

            // для токена в куках
        } else if (partURL === 'admin') {

            const { cookie } = headers;

            if (!cookie) {
                throw new Error('authorization cookie is missing')
            }

            token = getCookie(cookie, 'token')
            
            if (!token) {
                throw new Error('token in cookie not found')
            }
        }

        const dataPath = `/tokenRights/${token}`;

        let availablePaths = []

        try {
            availablePaths = DB.get(dataPath);
        } catch (e) {
            throw new Error(`token [${token}] not found`);
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
