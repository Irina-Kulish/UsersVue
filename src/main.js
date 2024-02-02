import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import Vuex from 'vuex';
import axios from 'axios';
import vuetifyPlugin from './plugins/vuetify';

Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    data: [],
  },
  mutations: {
    setData(state, newData) {
      state.data = newData;
    },
  },
  actions: {
    fetchData({ commit }) {
      axios.get('https://randomuser.me/api/?results=50')
        .then(response => {
          commit('setData', response.data.results);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
  },
});

new Vue({
  render: h => h(App),
  vuetify: vuetifyPlugin,
  store
}).$mount('#app');
