import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://lolalallama.herokuapp.com/api',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('lolaToken')}`
    }
});

export default axiosClient;