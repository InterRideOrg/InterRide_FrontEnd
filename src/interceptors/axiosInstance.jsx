import axios from 'axios';

const axiosInstance = axios.create({
    //baseURL: 'URL DEL RENDER',
    baseURL: 'http://localhost:8081/api/v1',
    headers: { 'Content-Type': 'application/json' }
}); 


axiosInstance.interceptors.request.use(

    function (config) {
        // Recuperar el token de local storage y agregarlo a los headers de la solicitud
        //const token = localStorage.getItem('authToken');
        const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlY29hZ3VpbGFmQGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1BBU0FKRVJPIiwiZXhwIjoxNzUzNDIyNzk5fQ.OI2RRF7APtTmLvrCg2kkn7mD_l64sIz6_jUV-Qo7kPhalvHhkwywnVuHZyNrUooPmRkZY4_RscwS0VcDn8-Cig"
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
  function (response) {
    console.log('Response:', response);
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      
      console.error('Unauthorized, logging out...');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
  