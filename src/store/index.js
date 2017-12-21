import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export function createStore() {
    return new Vuex.Store({
        state: {
            test: 0
        },
        actions: {
            getTest({ commit }, { test }) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        console.log(test, 'test')
                        commit('setTest', test);
                        resolve()
                    }, 1000);
                })
            }
        },
        mutations: {
            setTest(state, test) {
                console.log(test, '11111111111111')
                state.test = test;
            }
        }
    })
}