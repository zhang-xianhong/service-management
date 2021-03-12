interface UserInterface {
  id: string;
  username: string;
  token: string;
  permission: Permisson;
  pages: string[];
  roles: string[];
}
interface Permisson {
  [k: string]: string[];
}
export default {
  namespaced: true,
  state: {
    id: '',
    username: '',
    token: '',
    permission: {
      Dashboard: ['test'],
    },
    pages: [],
    roles: ['admin'],
  },
  getters: {
    token: (state: UserInterface) => state.token,
    permission: (state: UserInterface): Permisson => {
      if (Object.keys(state.permission).length > 0) {
        return state.permission;
      }
      if (localStorage.getItem('Permisson')) {
        return JSON.parse(localStorage.getItem('Permisson') || '');
      }
      return {};
    },
  },
  mutations: {
    setPermissions: (state: UserInterface, permissons: Permisson): void => {
      state.permission = permissons;
      localStorage.setItem('Permisson', JSON.stringify(permissons));
    },
    removePermissions: (state: UserInterface): void => {
      state.permission = {};
      localStorage.removeItem('Permisson');
    },
  },
  actions: {},
};
