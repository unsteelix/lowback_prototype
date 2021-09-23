const token = Cookies.get('token');

const dataRequest = (path) => {
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


let searchTimerId = null;

/**
 * Получение данных с задержкой
 * @param {*} inputStr - строка для поиска
 * @returns 
 */
const getDataByPath = (path) => {
    
    return new Promise((resolve, reject) => {

        if(searchTimerId){
            clearTimeout(searchTimerId);
        }
        searchTimerId = setTimeout(() => {
            const data = dataRequest(path);
            resolve(data)
        }, 1000);
        
    });
}


/**
 * 
 * @param {string} data - рендерит строку в формате JSON
 */
const renderTree = (data) => {
    $('.root').html('');
    JsonView.renderJSON(data, document.querySelector('.root'));
}


const updateTextarea = (text) => {
    const el = `<textarea id="textarea-input" rows="10" cols="45" name="json-text">${text}</textarea>`
    $('#textarea-place').html(el)
}


const inputForm = $('#search-input')[0]

/**
 * Обработчик ввода в строке поиска
 */
inputForm.addEventListener('input', async (e) => {
    const path = e.target.value;
  
    try {
        const data = await getDataByPath(path);
        const dataJSON = JSON.stringify(data)                 // JSON для дерева
        const dataBeauty = beautify(data, null, 2, 80)       // человекочитаемый JSON для редактора

        if (dataJSON) {
            updateTextarea(dataBeauty)
            renderTree(dataJSON)
        } else {
            updateTextarea('Not found')
            renderTree('')
        }

    } catch(e) {
        console.log('выводим ошибку', e)
    }

});


const updateButton = $('.update-button')[0]

/**
 * Обработчик кнопки Update
 */
 updateButton.addEventListener('click', async (e) => {
    try {
        const path = $('#search-input').val().trim()
        const textareaData = $('#textarea-input').val()

        try {
            // проверка JSON на валидность
            JSON.parse(textareaData)

            const res = await setDataRequest(path, textareaData)

            const dataBeauty = beautify(res, null, 2, 80)
            updateTextarea(dataBeauty)

        } catch(e) {
            alert('JSON не является валидным')
        }
       

    } catch(e) {
        console.log('выводим ошибку', e)
    }

});


const textareaHandler = async (e) => {
    console.log(e.target.value)
}