
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) : (global.Vuex = factory());
}(this, function() {
  let Vue;

  function install(_Vue) {
    if(Vue) {
      console.error('[EventBus] already installed. Vue.use(EventBus) should be called only once.');

      return;
    }

    Vue = _Vue;

    // auto install in dist mode
    if(typeof window !== 'undefined' && window.Vue) {
      install(window.Vue);
    }

    const EventBus = new Vue();

    // Add to Vue properties by exposing a getter for $bus
    Object.defineProperties(Vue.prototype, {
      $bus: {
        get() {
          return EventBus;
        },
      },
    });
  }

  return {
    install,
  };
}));
