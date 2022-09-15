const axios = require('axios').default;

const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');

const url: 'https://jsonplaceholder.typicode.com/posts';
const urlUsers: 'https://jsonplaceholder.typicode.com/users';

//Config Defaults
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com/';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;


//Use another instance and configure it in different ways
//Creating multiple instances with Axios to access multiple APIs
const newInstance = axios.create({
    baseURL: 'https://api.example.com',
    headers:{
        common:{
            Authorization : 'pseudo Token',
            ContentType : 'application/json';
        }
    }
});


// Do something before request is sent
// usado mais para authorizationToken
// Injeta algumas propriedade para uso
axios.interceptors.request.use(function (config) {
    config.headers.common.Authorization = 'testeToken';
    console.log("Teste antes de envio de requisição");
    return config;
    }, function (error) { // Do something with request error
        return Promise.reject(error);
    }
);


axios.interceptors.response.use(function (response) {
    console.log("Sucess");
    return response;
    }, function (error) { // Do something with request error
        console.log(error.response);
        //tratamento de erro global
        return Promise.reject(error);
    }
);


const get = () => {
    const configURI = {
        params: {_limit: 5}
    }

    axios.get('post', configURI)
    .then((response) => {
        renderOutput(response);
    })
    .catch((error) => {
        errorHandling(error);
    });
    .finally(() => {
        console.log('TESTE Gb');
    });
}

const post = () => {
    const dataObj = {
        userId: 1,
        title: 'foo',
        body: 'bar',
        title: 'foo'
    }
    
    axios.post('post', dataObj)
    .then((response) => {
        renderOutput(response);
    })
    .catch((error) => {
        errorHandling(error);
    })
    .finally(() => {
        console.log('TESTE 01');
    });
}

//genenal update of everyone params
const put = () => {
    let id = 4;
    const dataForUp = {
        title: 'foo',
        body: 'bar',
        title: 'lore Ipsilum'
    }

    const idFinded = findById(id);
    if(idFinded === false)
        renderOutput("Registro não encontrado");

    axios.put('post/'+id, dataForUp)
    .then((response) => {
        renderOutput(response);
    })
    .catch((error) => {
        errorHandling(error);
    })
    .finally(() => {
        console.log('TESTE 02');
    });
}

//partial update 
const patch = () => {
    let id = 4;
    const dataForUp = {
        title: 'foo'
    }

    const idFinded = findById(id);
    if(idFinded === false)
        renderOutput("Registro não encontrado");

    axios.patch('post/'+id, dataForUp)
    .then((response) => {
        renderOutput(response);
    })
    .catch((error) => {
        errorHandling(error);
    })
    .finally(() => {
        console.log('TESTE 03');
    });
}

const del = () => {
    let id = 4;
    const idFinded = findById(id);
    let authorizationToken = 'Token';
    if(idFinded === false)
        renderOutput("Registro não encontrado");

    axios.delete('post/'+id, {
        headers: {
            Authorization: authorizationToken
        }
    })
    .then((response) => {
        renderOutput(response);
    })
    .catch((error) => {
        errorHandling(error);
    })
    .finally(() => {
        console.log('TESTE 04');
    });
}

const multiple = () => {
    console.log('multiple Request in Parallel');

    Promise.all(values [
        axios.get(url),
        axios.get(urlUsers)
    ])
    .then((response) => {
        let posts = response[0].data;
        let users = response[1].data;
            //console.table mais usado para array em formato matricial 
        console.table(posts);
        console.table(users);
    })
    .catch((error) => {
        errorHandling(error);
    })
    .finally(() => {
        console.log('TESTE 05');
    });
}

const transform = () => {
    const configURI = {
        params: {_limit: 5},
        /* é um get default
         intuido é transfomar o dado para a saida como solicitado a depender do caso.
         exemplo abaixo : inseri dados de endereço para esse item aleatoriamente. */
        transformResponse: [function (data) { 
            const payload = JSON.parse(data).map(item => {
                return { ...item,  // Incluir dados ápos o objeto e construir um novo.
                    avenue: 'test of tes', 
                    location: {rua: 'X', bairro: 'Y'}, 
                    address: 'lorem Ipsilum' 
                }
            });
            return payload;
        }]
    };

    axios.get('post', configURI)
    .then((response) => {
        renderOutput(response);
    })
    .catch((error) => {
        errorHandling(error); 
    });
    .finally(() => {
        console.log('TESTE Gb');
    });
}

const errorHandling = (error) => {
    // create object for filter the caractery of error 
    console.log(error.config);
    if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        return error.response;
    } else if (error.request) {
        console.log(error.request);
        return error.request;
    } else {
      console.log('Error', error.message);
      return error.message;
    }
};

//Cancel Requests
const cancel = () => {
    const controller = new AbortController();
    const configURI = {
        params: {_limit: 5},
        signal: controller.signal
    }

    axios.get('post', configURI)
    .then((response) => {
        renderOutput(response);
    })
    .catch(function(error) {
        errorHandling(error);
    });
    .finally(()=> {
        console.log('TESTE Gb');
    });

    // cancel the request
    controller.abort()}

const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
}

const renderOutput = (response) => {
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}


document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);