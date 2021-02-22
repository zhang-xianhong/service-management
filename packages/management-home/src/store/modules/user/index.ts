interface UserInterface {
  id: string;
  username: string;
  token: string;
}
export default {
  namespaced: true,
  state: {
    id: '',
    username: '',
    token: ''
  },
  getters: {
    token: (state: UserInterface) => state.token
  },
  mutations: {
  },
  actions: {
  }
}
