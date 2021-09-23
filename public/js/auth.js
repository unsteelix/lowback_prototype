/**
 * Запрос на получение токена
 * @param {} pass - пароль
 * @returns 
 */
const tokenRequest = (pass) => {
    return axios.get(`/auth/lowback/${pass}`)
    .then((res) => res.data)
}

let loginTimerId = null;

/**
 * Получение токена с задержкой
 * @param {*} pass - пароль
 * @returns 
 */
const getToketByPass = (pass) => {
    
    return new Promise((resolve, reject) => {

        if(loginTimerId){
            clearTimeout(loginTimerId);
        }
        loginTimerId = setTimeout(() => {
            const token = tokenRequest(pass);
            resolve(token)
        }, 1000);
        
    });
}


/**
 * Показ ссылок на разные страницы сервиса
 */
const showLinksBlock = () => {
    $( ".links-block" ).removeClass( "hidden" )
    $( ".login-block" ).addClass( "hidden" )
}


const inputForm = $('#login-form-input')[0]

/**
 * Обработчик ввода в форме авторизации
 */
inputForm.addEventListener('input', async (e) => {
    const pass = e.target.value

    try {
        const token = await getToketByPass(pass);

        if (token) {
            Cookies.set('token', token, { expires: 7 }); // 7 дней
            showLinksBlock()
        }

    } catch(e) {
        console.log('выводим ошибку', e)
    }

});
