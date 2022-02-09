import Vue from 'vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import FormCnab from '@/components/FormCnab.vue';

Vue.use(Vuex);

describe('FormCnab', () => {
  it('FormCnab is a vue component', () => {
    const store = new Vuex.Store({
      modules: {
        module: {
          getters: { reportData: () => jest.fn() },
        },
      },
    });

    const localVue = createLocalVue();
    localVue.use(VueRouter);
    const router = new VueRouter();

    const wrapper = shallowMount(FormCnab, {
      localVue,
      router,
      store,
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('has data', () => {
    expect(typeof FormCnab.data).toBe('function');
  });
});
