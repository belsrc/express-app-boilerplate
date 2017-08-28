'use strict';

class ExtendableError extends Error {
  constructor(message) {
    super(message);

    // Extending Error is weird and you need to make the props non-enumerable
    // or you will get annoying logs
    //
    // Normal error
    // console.log(new Error('Test')) >> [Error: Test]
    //
    // Extended with OUT the following Object.defineProperty
    // console.log(new TestError('Test')) >> { [TestError: Test] name: 'TestError' }
    Object.defineProperty(this, 'message', {
      configurable: true,
      enumerable: false,
      value: message.toString(), // toString in case its a rethrow so we get Error: Msg instead of [Error: Msg]
      writable: true,
    });

    Object.defineProperty(this, 'name', {
      configurable: true,
      enumerable: false,
      value: this.constructor.name,
      writable: true,
    });

    if(Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(this, this.constructor);
      return;
    }

    Object.defineProperty(this, 'stack', {
      configurable: true,
      enumerable: false,
      value: (new Error(message)).stack,
      writable: true,
    });
  }
}

/**
 * Gets the {@link ExtendableError} class.
 * @module
 */
module.exports = ExtendableError;
