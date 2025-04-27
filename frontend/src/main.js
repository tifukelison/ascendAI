import 'bootstrap/dist/css/bootstrap.min.css';
import { createApp } from 'vue'
import './style.css'
import App from './App.vue';
import router from './router';
import store from './store'; // Import the store


const app = createApp(App);

app.use(store); // Use the store
app.use(router);

app.mount('#app');
