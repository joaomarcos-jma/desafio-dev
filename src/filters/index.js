import Vue from 'vue';
import moment from 'moment';
import constants from '../util/constants';

Vue.filter('cpfOrCnpj', (value) => {
  if (value.length !== 11) {
    return value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
      '$1.$2.$3/$4-$5',
    );
  }
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
});

Vue.filter('currency', (value) => {
  try {
    return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
  } catch (error) {
    console.error(error);
    return value;
  }
});

Vue.filter('displayLabelTransaction', (value) => {
  const result = constants.transactions_types.find((res) => res.value === Number(value));
  return result.label;
});

Vue.filter('displayDate', (value) => {
  const dateFormat = moment(String(value)).format('YYYY-MM-DD HH:mm:ss');
  const date = moment(String(dateFormat)).format('DD/MM/YYYY - HH:mm');
  return date.split('-').join('às');
});
