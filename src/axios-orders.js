import axios from 'axios';

const instance = axios.create({
   baseURL: 'https://my-burger-builder-pnt.firebaseio.com/'
});

export default instance;
