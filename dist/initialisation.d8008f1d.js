// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"../node_modules/@babel/runtime/regenerator/index.js":[function(require,module,exports) {
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":"../node_modules/regenerator-runtime/runtime.js"}],"../node_modules/@babel/runtime/helpers/asyncToGenerator.js":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{}],"../node_modules/@babel/runtime/helpers/classCallCheck.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],"../node_modules/@babel/runtime/helpers/createClass.js":[function(require,module,exports) {
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{}],"game/tileset.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tileset = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tileset =
/*#__PURE__*/
function () {
  function Tileset(url) {
    (0, _classCallCheck2.default)(this, Tileset);
    this.image = new Image();
    this.image.src = url;
    this.largeur = this.image.width / 32;
    this.image.onload = this.isLoaded;
  }

  (0, _createClass2.default)(Tileset, [{
    key: "isLoaded",
    value: function isLoaded(event) {
      if (!event.target.complete) throw new Error("Erreur de chargement du tileset nommé \"" + this.image.src + "\".");else {
        this.loaded = true;
      }
    }
  }, {
    key: "drawTile",
    value: function drawTile(index, context, xPosition, yPosition) {
      var tileRow = Math.ceil(index / this.largeur);
      var tileCol = index % this.largeur;
      if (tileCol === 0) tileCol = this.largeur;
      var xSource = (tileCol - 1) * 32;
      var ySource = (tileRow - 1) * 32;
      context.drawImage(this.image, xSource, ySource, 32, 32, xPosition, yPosition, 32, 32);
    }
  }]);
  return Tileset;
}();

exports.Tileset = Tileset;
},{"@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js"}],"public/images/tilesets/ground.png":[function(require,module,exports) {
module.exports = "/ground.47227ce8.png";
},{}],"public/images/tilesets/tiles.png":[function(require,module,exports) {
module.exports = "/tiles.200b15ee.png";
},{}],"game/map.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Map = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _tileset = require("./tileset.js");

var _ground = _interopRequireDefault(require("../public/images/tilesets/ground.png"));

var _tiles = _interopRequireDefault(require("../public/images/tilesets/tiles.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IMG = {
  ground: _ground.default,
  tiles: _tiles.default
};

var Map =
/*#__PURE__*/
function () {
  function Map(map) {
    (0, _classCallCheck2.default)(this, Map);
    this.layers = new Array();

    for (var layer in map) {
      this.layers.push({
        tileset: new _tileset.Tileset(IMG[map[layer].tileset]),
        field: map[layer].field
      });
    }

    ;
  }

  (0, _createClass2.default)(Map, [{
    key: "addUnit",
    value: function addUnit(unit) {
      this.unit = unit;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.layers[0].field.length;
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.layers[0].field[0].length;
    }
  }, {
    key: "drawMap",
    value: function drawMap(context, callback) {
      this.layers.forEach(function (layer) {
        for (var i = 0, l = layer.field.length; i < l; i++) {
          var line = layer.field[i];
          var y = i * 32;

          for (var j = 0, k = line.length; j < k; j++) {
            var x = j * 32;
            if (line[j] != "00") layer.tileset.drawTile(parseInt(line[j], 10), context, x, y);
          }

          ;
        }

        ;
      });
      if (this.unit) this.unit.draw(context, function (res) {
        callback(res);
      });
    }
  }]);
  return Map;
}();

exports.Map = Map;
},{"@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","./tileset.js":"game/tileset.js","../public/images/tilesets/ground.png":"public/images/tilesets/ground.png","../public/images/tilesets/tiles.png":"public/images/tilesets/tiles.png"}],"data/map.json":[function(require,module,exports) {
module.exports = {
  "firstLayer": {
    "tileset": "ground",
    "field": [["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"], ["01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01", "01"]]
  },
  "mountainsLayer": {
    "tileset": "tiles",
    "field": [["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"], ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00", "00"]]
  }
};
},{}],"public/images/mountains.png":[function(require,module,exports) {
module.exports = "/mountains.3adf196b.png";
},{}],"public/images/startPoint.png":[function(require,module,exports) {
module.exports = "/startPoint.6cd8789d.png";
},{}],"public/images/flag.png":[function(require,module,exports) {
module.exports = "/flag.4eb8d562.png";
},{}],"game/scenario.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scenario = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DIRECTION = {
  TOP: {
    y: -1,
    x: 0,
    mouve: "MOUVE_TOP"
  },
  DOWN: {
    y: 1,
    x: 0,
    mouve: "MOUVE_DOWN"
  },
  RIGHT: {
    y: 0,
    x: 1,
    mouve: "MOUVE_RIGHT"
  },
  LEFT: {
    y: 0,
    x: -1,
    mouve: "MOUVE_LEFT"
  }
};

var Scenario =
/*#__PURE__*/
function () {
  // ré implementer le not wantedDir, propre à chaque scenario (un scenario qui se lance en mouve right, not wanted left CQFD tmtc)
  function Scenario(startPoint, deplacementField, endPoint, results, scenarios) {
    var mouvement = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var history = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : new Array();
    var route = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : new Array();
    (0, _classCallCheck2.default)(this, Scenario);
    this.state = {
      startPoint: startPoint,
      deplacementField: deplacementField,
      endPoint: endPoint,
      mouvement: mouvement,
      history: history,
      position: startPoint
    };
    this.route = route;
    this.scenarios = scenarios;
    this.results = results;
    this.statut = "running";
  }

  (0, _createClass2.default)(Scenario, [{
    key: "mouve",
    value: function mouve() {
      this.direction = this.getDirection();
      this.bindNewScenarios(this.direction);

      if (this.mouveIsPossible(this.direction)) {
        this.state.history.push({
          y: this.state.position.y,
          x: this.state.position.x
        });
        this.state.position = {
          y: this.state.position.y + this.direction.y,
          x: this.state.position.x + this.direction.x
        };
        this.route.push(this.direction.mouve);
        this.state.mouvement++;

        if (this.state.position.y === this.state.endPoint.y && this.state.position.x === this.state.endPoint.x) {
          this.results.push(this);
          this.statut = 'success';
        } else this.statut = "running";
      } else this.statut = "echec";
    }
  }, {
    key: "bindNewScenarios",
    value: function bindNewScenarios(nextDirection) {
      for (var dir in DIRECTION) {
        if (this.mouveIsPossible(DIRECTION[dir])) {
          if (nextDirection != DIRECTION[dir] && this.notInScenario(DIRECTION[dir])) {
            var position = {
              y: this.state.position.y + DIRECTION[dir].y,
              x: this.state.position.x + DIRECTION[dir].x
            },
                history = this.copyArray(this.state.history),
                route = this.copyArray(this.route),
                mouvement = this.state.mouvement + 1;
            history.push(this.state.position);
            route.push(DIRECTION[dir].mouve);
            var newScenario = new Scenario(position, this.state.deplacementField, this.state.endPoint, this.results, this.scenarios, mouvement, history, route);
            this.scenarios.push(newScenario);
          }
        }

        ;
      }

      ;
    }
  }, {
    key: "getDirection",
    value: function getDirection() {
      if (Math.abs(this.state.endPoint.y - this.state.position.y) > Math.abs(this.state.endPoint.x - this.state.position.x)) return this.state.endPoint.y < this.state.position.y ? DIRECTION.TOP : DIRECTION.DOWN;else return this.state.endPoint.x < this.state.position.x ? DIRECTION.LEFT : DIRECTION.RIGHT;
    }
  }, {
    key: "mouveIsPossible",
    value: function mouveIsPossible(direction) {
      return this.inField(direction) && this.state.deplacementField.field[this.state.position.y + direction.y][this.state.position.x + direction.x] != "02" && this.notInHistory(direction) ? true : false;
    }
  }, {
    key: "notInScenario",
    value: function notInScenario(direction) {
      var that = this;
      if (this.scenarios.find(function (scenario) {
        return scenario.state.position.y === that.state.position.y + direction.y && scenario.state.position.x === that.state.position.x + direction.x;
      })) return false;else return true;
    }
  }, {
    key: "inField",
    value: function inField(direction) {
      var dirY = this.state.position.y + direction.y,
          dirX = this.state.position.x + direction.x;
      if (dirY >= 0 && dirX >= 0 && dirY < this.state.deplacementField.field.length && dirX < this.state.deplacementField.field[0].length) return true;else return false;
    }
  }, {
    key: "notInHistory",
    value: function notInHistory(direction) {
      var that = this;
      if (this.state.history.find(function (position) {
        return position.y === that.state.position.y + direction.y && position.x === that.state.position.x + direction.x;
      })) return false;else return true;
    }
  }, {
    key: "copyArray",
    value: function copyArray(array) {
      var newArray = new Array();

      for (var i = 0, l = array.length; i < l; i++) {
        newArray[i] = array[i];
      }

      return newArray;
    }
  }]);
  return Scenario;
}();

exports.Scenario = Scenario;
},{"@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js"}],"game/PathFinder.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PathFinder = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _scenario = require("./scenario.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PathFinder =
/*#__PURE__*/
function () {
  function PathFinder(startPoint, deplacementField, endPoint) {
    (0, _classCallCheck2.default)(this, PathFinder);
    this.state = {
      startPoint: startPoint,
      deplacementField: deplacementField,
      endPoint: endPoint,
      position: startPoint
    };
    this.results = new Array();
    this.scenarios = new Array();
    this.scenarios.push(new _scenario.Scenario(this.state.startPoint, this.state.deplacementField, this.state.endPoint, this.results, this.scenarios));
  }

  (0, _createClass2.default)(PathFinder, [{
    key: "run",
    value: function run() {
      while (this.statut != 'end') {
        var end = true;
        if (this.results.length > 0) this.cost = this.getBestWay().state.mouvement;

        for (var i = 0, l = this.scenarios.length; i < l; i++) {
          if (this.scenarios[i].statut === "running") {
            if (this.cost && this.scenarios[i].state.mouvement > this.cost) this.scenarios[i].statut = "echec";else {
              end = false;
              this.scenarios[i].mouve();
            }
          }
        }

        if (end) this.statut = "end";
      }
    }
  }, {
    key: "getBestWay",
    value: function getBestWay() {
      var bestWay = false;

      for (var i = 0, l = this.results.length; i < l; i++) {
        bestWay = !bestWay ? this.results[i] : bestWay;
        bestWay = this.results[i].state.mouvement < bestWay.state.mouvement ? this.results[i] : bestWay;
      }

      return bestWay;
    }
  }]);
  return PathFinder;
}();

exports.PathFinder = PathFinder;
},{"@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","./scenario.js":"game/scenario.js"}],"public/images/characterSprites/Skull.png":[function(require,module,exports) {
module.exports = "/Skull.440c2dfc.png";
},{}],"game/unit.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Unit = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _Skull = _interopRequireDefault(require("../public/images/characterSprites/Skull.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DIRECTION = {
  40: 0,
  37: 1,
  39: 2,
  38: 3
};
var DUREE_ANIMATION = 3;
var DUREE_DEPLACEMENT = 9;

var Unit =
/*#__PURE__*/
function () {
  function Unit(x, y, direction) {
    (0, _classCallCheck2.default)(this, Unit);
    this.eventPile = new Array();
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.src = _Skull.default;
    this.etatAnimation = -1;
    this.image = new Image();
    this.image.src = this.src;
    this.image.ref = this;

    this.image.onload = function () {
      if (!this.complete) throw "Erreur de chargement du sprite Character";
      this.ref.width = this.width / 3;
      this.ref.height = this.height / 4;
    };
  }

  (0, _createClass2.default)(Unit, [{
    key: "draw",
    value: function draw(context, callback) {
      if (this.x === -1) return callback(false);
      var frame = 1; // Numéro de l'image à prendre pour l'animation

      var decalageX = 0,
          decalageY = 0; // Décalage à appliquer à la position du personnage

      if (this.etatAnimation >= DUREE_DEPLACEMENT) {
        this.etatAnimation = -1;
        clearInterval(this.animation);
        callback(true);
      } else if (this.etatAnimation >= 0) {
        // On calcule l'image (frame) de l'animation à afficher
        frame = Math.floor(this.etatAnimation / DUREE_ANIMATION);
        if (frame > 2) frame %= 3; // Nombre de pixels restant à parcourir entre les deux cases

        var pixelsAParcourir = 32 - 32 * (this.etatAnimation / DUREE_DEPLACEMENT); // À partir de ce nombre, on définit le décalage en x et y.
        // NOTE : Si vous connaissez une manière plus élégante que ces quatre conditions, je suis preneur

        if (this.direction === 3) decalageY = pixelsAParcourir; //haut?
        else if (this.direction === 0) decalageY = -pixelsAParcourir; //bas?
          else if (this.direction === 1) decalageX = pixelsAParcourir; //gauche?
            else if (this.direction === 2) decalageX = -pixelsAParcourir; //droite?

        this.etatAnimation++;
      } // * Si aucune des deux conditions n'est vraie, c'est qu'on est immobile, 
      // * donc il nous suffit de garder les valeurs 0 pour les variables 
      // * frame, decalageX et decalageY


      context.drawImage(this.image, frame * this.width, this.direction * this.height, this.width, this.height, this.x * 32 + decalageX, this.y * 32 - 8 + decalageY, this.width, this.height);
    }
  }]);
  return Unit;
}();

exports.Unit = Unit;
},{"@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","../public/images/characterSprites/Skull.png":"public/images/characterSprites/Skull.png"}],"initialisation.js":[function(require,module,exports) {
"use strict";

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _map = require("./game/map.js");

var _map2 = _interopRequireDefault(require("./data/map.json"));

var _mountains = _interopRequireDefault(require("./public/images/mountains.png"));

var _startPoint = _interopRequireDefault(require("./public/images/startPoint.png"));

var _flag = _interopRequireDefault(require("./public/images/flag.png"));

var _PathFinder = require("./game/PathFinder.js");

var _unit = require("./game/unit.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tiles = {
  mountains: {
    src: _mountains.default,
    i: 0,
    value: '02',
    type: 'mountains'
  },
  startPoint: {
    src: _startPoint.default,
    i: 32,
    value: '01',
    type: 'startPoint'
  },
  flag: {
    src: _flag.default,
    i: 64,
    value: '03',
    type: 'flag'
  }
}; // import {mouvement} from './mouvement/mouvement.js';

var canva = document.getElementById('Canva');
var context = canva.getContext('2d');
var tilesBoard = document.getElementById('Tiles');
var button = document.getElementById('ValidateButton');
var currentTile;

for (var tile in tiles) {
  var img = document.createElement('img');
  img.src = tiles[tile].src;
  img.setAttribute('value', tiles[tile].value);
  img.setAttribute('type', tiles[tile].type);
  img.classList.add('tiles');
  img.style.marginTop = tiles[tile].i + 'px';
  img.addEventListener('click', selectTile);

  if (tile === 'mountains') {
    img.classList.add('selected');
    currentTile = img;
  }

  tilesBoard.appendChild(img);
}

function selectTile(event) {
  currentTile.classList.remove('selected');
  currentTile = event.currentTarget;
  currentTile.classList.add('selected');
}

var map = new _map.Map(_map2.default);
canva.width = map.getWidth() * 32;
canva.height = map.getHeight() * 32;
canva.style.position = "absolute";
canva.style.left = "calc(50% - " + canva.width / 2 + "px)";
canva.style.top = "calc(50% - " + canva.height / 2 + "px)"; //map.battleField.addUnit(new Unit('Skull', 22, 3, 0));
//map.battleField.addUnit(new Unit('Skull', 20, 3, 0));

window.onload = function () {
  map.drawMap(context);
  canva.addEventListener('mousemove', mouseMove);
  canva.addEventListener('click', click);
}; // function tryMouve(event) {
// 	let clientY = Math.floor(event.layerY/32);
// 	let clientX = Math.floor(event.layerX/32);
// 	let way;
// 	for (let i = 0, l = this.deplacementField.length; i < l; i++) {
// 		let finded = this.deplacementField[i].find(
// 			scenario => (scenario 
// 				&& scenario.route 
// 					&& clientY === scenario.position.line 
// 						&& clientX === scenario.position.cell
// 			)
// 		);
// 		if (finded) way = finded;
// 	}
// 	if (way) moveUnit(this, way);
// 	else return;
// }


function moveUnit(_x, _x2) {
  return _moveUnit.apply(this, arguments);
}

function _moveUnit() {
  _moveUnit = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(unit, way) {
    var i, l, event, mouve;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            i = 0, l = way.length;

          case 1:
            if (!(i < l)) {
              _context.next = 28;
              break;
            }

            event = way.shift();
            _context.t0 = true;
            _context.next = _context.t0 === (event === 'MOUVE_DOWN') ? 6 : _context.t0 === (event === 'MOUVE_TOP') ? 10 : _context.t0 === (event === 'MOUVE_LEFT') ? 14 : _context.t0 === (event === 'MOUVE_RIGHT') ? 18 : 22;
            break;

          case 6:
            unit.direction = 0;
            unit.y++;
            unit.etatAnimation = 1;
            return _context.abrupt("break", 22);

          case 10:
            unit.direction = 3;
            unit.y--;
            unit.etatAnimation = 1;
            return _context.abrupt("break", 22);

          case 14:
            unit.direction = 1;
            unit.x--;
            unit.etatAnimation = 1;
            return _context.abrupt("break", 22);

          case 18:
            unit.direction = 2;
            unit.x++;
            unit.etatAnimation = 1;
            return _context.abrupt("break", 22);

          case 22:
            mouve = new Promise(function (res, rej) {
              unit.animation = setInterval(function () {
                map.drawMap(context, function (resp) {
                  if (resp) {
                    res(true);
                  }
                });
              }, 30);
            });
            _context.next = 25;
            return mouve;

          case 25:
            i++;
            _context.next = 1;
            break;

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _moveUnit.apply(this, arguments);
}

var oldPosition = {
  clientX: -1,
  clientY: -1
};
var positions = {};
var itineraire = {};

function mouseMove(event) {
  var clientY = Math.floor(event.layerY / 32);
  var clientX = Math.floor(event.layerX / 32);
  if (oldPosition.clientX != -1 && !positions[oldPosition.clientY + '$' + oldPosition.clientX]) map.layers[1].field[oldPosition.clientY][oldPosition.clientX] = "00";

  for (var key in positions) {
    var coords = key.split('$');
    var line = parseInt(coords[0], 10);
    var cell = parseInt(coords[1], 10);
    map.layers[1].field[line][cell] = positions[key];
  }

  if (!positions[clientY + '$' + clientX] || positions[clientY + '$' + clientX] != currentTile.getAttribute('value')) {
    map.layers[1].field[clientY][clientX] = currentTile.getAttribute('value');
    oldPosition = {
      clientY: clientY,
      clientX: clientX
    };
  }

  map.drawMap(context);
}

function click(event) {
  var clientY = Math.floor(event.layerY / 32);
  var clientX = Math.floor(event.layerX / 32);
  var type = currentTile.getAttribute('type');
  positions[clientY + '$' + clientX] = currentTile.getAttribute('value');

  for (var _type in itineraire) {
    if (itineraire[_type].y && itineraire[_type].y === clientY && itineraire[_type].x === clientX) itineraire[_type] = false;
  }

  if (type != 'mountains') {
    if (itineraire[type]) {
      positions[itineraire[type].y + '$' + itineraire[type].x] = "00";
      map.layers[1].field[itineraire[type].y][itineraire[type].x] = "00";
      map.drawMap(context);
    }

    itineraire[type] = {
      y: clientY,
      x: clientX
    };
  }
}

button.addEventListener('click', function () {
  var unit = new _unit.Unit(itineraire.startPoint.x, itineraire.startPoint.y, 0);
  var way = new _PathFinder.PathFinder(itineraire.startPoint, map.layers[1], itineraire.flag);
  map.addUnit(unit);
  positions[itineraire.startPoint.y + '$' + itineraire.startPoint.x] = "00";
  map.layers[1].field[itineraire.startPoint.y][itineraire.startPoint.x] = "00";
  map.drawMap(context);
  way.run();
  way = way.getBestWay();
  moveUnit(unit, way.route);
});
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","./game/map.js":"game/map.js","./data/map.json":"data/map.json","./public/images/mountains.png":"public/images/mountains.png","./public/images/startPoint.png":"public/images/startPoint.png","./public/images/flag.png":"public/images/flag.png","./game/PathFinder.js":"game/PathFinder.js","./game/unit.js":"game/unit.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "40749" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","initialisation.js"], null)
//# sourceMappingURL=/initialisation.d8008f1d.js.map