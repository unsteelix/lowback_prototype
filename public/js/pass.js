$('#textarea-input').autoResize();

const updateButton = $('.update-button')[0]

const currentUrl = window.location.href;

const urlParts = currentUrl.split('/');
const token = urlParts[urlParts.length - 1]

const setDataRequest = (path, data) => {
    return axios.post(`/db/set${path}`, data, {
        headers: {
          'Authorization': `jwt ${token}`,
          'content-type': 'application/json'
        }
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(error)
      })
}


const getDataRequest = (path) => {
    return axios.get(`/db${path}`, {
        headers: {
          'Authorization': `jwt ${token}`
        }
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(error)
      })
}


const init = async () => {
    const initData = await getDataRequest(`/pass/${token}`)

    console.log('INNIT', initData)

    $('#textarea-input').html(initData)
}
init()




/**
 * Обработчик кнопки Update
 */
 updateButton.addEventListener('click', async (e) => {
    try {
        const textareaData = $('#textarea-input').val()

        const jsonText = JSON.stringify(textareaData)

        try {
            // проверка JSON на валидность
            JSON.parse(jsonText)

            const res = await setDataRequest(`/pass/${token}`, jsonText)
            $('.block-editing').html(`<textarea id="textarea-input" rows="30" cols="70" name="json-text">${res}</textarea>`)

        } catch(e) {
            console.log(e)
        }
       

    } catch(e) {
        console.log('выводим ошибку', e)
    }

});