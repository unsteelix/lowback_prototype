/**
 * Очищаем URL от префиксов /set, /query, /set и тп.
 */
const removeUrlPathPrefix = (url) => {

    const prefixes = ['/db/query', '/db/set', '/db/merge', '/db/push', '/db/delete', '/db']

    let cleanUrl = url

    prefixes.forEach((prefix) => {

        if (url.includes(prefix)) {

            const partURL = url.slice(0, prefix.length)

            if (prefix === partURL) {
                cleanUrl = url.slice(prefix.length)
            }

        }

    })

    return cleanUrl
}

const getCookie = (rawCookieStr, name) => {
    let matches = rawCookieStr.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export { removeUrlPathPrefix, getCookie };