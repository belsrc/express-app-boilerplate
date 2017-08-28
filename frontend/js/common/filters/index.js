// import filterName from './filter-name';

const filters = {
  // filterName,
};

export default {
  filters,

  install(Vue) {
    const keys = Object.keys(filters);

    keys.forEach(name => Vue.filter(name, filters[name]));
  },
};
