const actions = {
  async reportFile({ commit }, payload) {
    //  post('/report/transaction', formData);
    commit('REPORT_DATA', payload);
  },
};

export default actions;
