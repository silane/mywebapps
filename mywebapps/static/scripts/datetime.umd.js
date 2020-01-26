(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.datetime = {}));
}(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.4',
	  mode:  'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }
	  if (O === global_1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push.call(target, value); // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};

	var defineProperty = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var $map = arrayIteration.map;



	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');
	// FF49- issue
	var USES_TO_LENGTH = arrayMethodUsesToLength('map');

	// `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

	var SPECIES$2 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$1 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$2];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('splice');
	var USES_TO_LENGTH$2 = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

	var max$2 = Math.max;
	var min$2 = Math.min;
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$2 }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject(this);
	    var len = toLength(O.length);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$2(max$2(toInteger(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }
	    A = arraySpeciesCreate(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	var defineProperty$1 = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name
	if (descriptors && !(NAME in FunctionPrototype)) {
	  defineProperty$1(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  } return it;
	};

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    objectSetPrototypeOf &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    typeof (NewTarget = dummy.constructor) == 'function' &&
	    NewTarget !== Wrapper &&
	    isObject(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	// a string of all valid unicode whitespaces
	// eslint-disable-next-line max-len
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$2 = function (TYPE) {
	  return function ($this) {
	    var string = String(requireObjectCoercible($this));
	    if (TYPE & 1) string = string.replace(ltrim, '');
	    if (TYPE & 2) string = string.replace(rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$2(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
	  end: createMethod$2(2),
	  // `String.prototype.trim` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
	  trim: createMethod$2(3)
	};

	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
	var defineProperty$2 = objectDefineProperty.f;
	var trim = stringTrim.trim;

	var NUMBER = 'Number';
	var NativeNumber = global_1[NUMBER];
	var NumberPrototype = NativeNumber.prototype;

	// Opera ~12 has broken Object#toString
	var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

	// `ToNumber` abstract operation
	// https://tc39.github.io/ecma262/#sec-tonumber
	var toNumber = function (argument) {
	  var it = toPrimitive(argument, false);
	  var first, third, radix, maxCode, digits, length, index, code;
	  if (typeof it == 'string' && it.length > 2) {
	    it = trim(it);
	    first = it.charCodeAt(0);
	    if (first === 43 || first === 45) {
	      third = it.charCodeAt(2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (it.charCodeAt(1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
	        default: return +it;
	      }
	      digits = it.slice(2);
	      length = digits.length;
	      for (index = 0; index < length; index++) {
	        code = digits.charCodeAt(index);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	// `Number` constructor
	// https://tc39.github.io/ecma262/#sec-number-constructor
	if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
	  var NumberWrapper = function Number(value) {
	    var it = arguments.length < 1 ? 0 : value;
	    var dummy = this;
	    return dummy instanceof NumberWrapper
	      // check on 1..constructor(foo) case
	      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
	        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
	  };
	  for (var keys$1 = descriptors ? getOwnPropertyNames(NativeNumber) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j = 0, key; keys$1.length > j; j++) {
	    if (has(NativeNumber, key = keys$1[j]) && !has(NumberWrapper, key)) {
	      defineProperty$2(NumberWrapper, key, getOwnPropertyDescriptor$2(NativeNumber, key));
	    }
	  }
	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  redefine(global_1, NUMBER, NumberWrapper);
	}

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	var trim$1 = stringTrim.trim;


	var $parseInt = global_1.parseInt;
	var hex = /^[+-]?0[Xx]/;
	var FORCED$1 = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22;

	// `parseInt` method
	// https://tc39.github.io/ecma262/#sec-parseint-string-radix
	var numberParseInt = FORCED$1 ? function parseInt(string, radix) {
	  var S = trim$1(String(string));
	  return $parseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
	} : $parseInt;

	// `parseInt` method
	// https://tc39.github.io/ecma262/#sec-parseint-string-radix
	_export({ global: true, forced: parseInt != numberParseInt }, {
	  parseInt: numberParseInt
	});

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var TO_STRING = 'toString';
	var RegExpPrototype = RegExp.prototype;
	var nativeToString = RegExpPrototype[TO_STRING];

	var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME = nativeToString.name != TO_STRING;

	// `RegExp.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

	// `String.prototype.repeat` method implementation
	// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
	var stringRepeat = ''.repeat || function repeat(count) {
	  var str = String(requireObjectCoercible(this));
	  var result = '';
	  var n = toInteger(count);
	  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
	  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
	  return result;
	};

	// https://github.com/tc39/proposal-string-pad-start-end




	var ceil$1 = Math.ceil;

	// `String.prototype.{ padStart, padEnd }` methods implementation
	var createMethod$3 = function (IS_END) {
	  return function ($this, maxLength, fillString) {
	    var S = String(requireObjectCoercible($this));
	    var stringLength = S.length;
	    var fillStr = fillString === undefined ? ' ' : String(fillString);
	    var intMaxLength = toLength(maxLength);
	    var fillLen, stringFiller;
	    if (intMaxLength <= stringLength || fillStr == '') return S;
	    fillLen = intMaxLength - stringLength;
	    stringFiller = stringRepeat.call(fillStr, ceil$1(fillLen / fillStr.length));
	    if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
	    return IS_END ? S + stringFiller : stringFiller + S;
	  };
	};

	var stringPad = {
	  // `String.prototype.padStart` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.padstart
	  start: createMethod$3(false),
	  // `String.prototype.padEnd` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.padend
	  end: createMethod$3(true)
	};

	// https://github.com/zloirock/core-js/issues/280


	// eslint-disable-next-line unicorn/no-unsafe-regex
	var stringPadWebkitBug = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(engineUserAgent);

	var $padStart = stringPad.start;


	// `String.prototype.padStart` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.padstart
	_export({ target: 'String', proto: true, forced: stringPadWebkitBug }, {
	  padStart: function padStart(maxLength /* , fillString = ' ' */) {
	    return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
	// so we use an intermediate function.
	function RE(s, f) {
	  return RegExp(s, f);
	}

	var UNSUPPORTED_Y = fails(function () {
	  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	  var re = RE('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	var BROKEN_CARET = fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = RE('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
		UNSUPPORTED_Y: UNSUPPORTED_Y,
		BROKEN_CARET: BROKEN_CARET
	};

	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');
	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = String(str).slice(re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
	  exec: regexpExec
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points







	var SPECIES$3 = wellKnownSymbol('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	var REPLACE = wellKnownSymbol('replace');
	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }
	  return false;
	})();

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$3] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !(
	      REPLACE_SUPPORTS_NAMED_GROUPS &&
	      REPLACE_KEEPS_$0 &&
	      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    )) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	        }
	        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	      }
	      return { done: false };
	    }, {
	      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
	      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];

	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return regexMethod.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return regexMethod.call(string, this); }
	    );
	  }

	  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
	};

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$4 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING ? S.charAt(position) : first
	        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$4(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$4(true)
	};

	var charAt = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
	};

	// `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	var max$3 = Math.max;
	var min$3 = Math.min;
	var floor$1 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// @@replace logic
	fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
	  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
	  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

	  return [
	    // `String.prototype.replace` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible(this);
	      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	      return replacer !== undefined
	        ? replacer.call(searchValue, O, replaceValue)
	        : nativeReplace.call(String(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	    function (regexp, replaceValue) {
	      if (
	        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
	        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
	      ) {
	        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
	        if (res.done) return res.value;
	      }

	      var rx = anObject(regexp);
	      var S = String(this);

	      var functionalReplace = typeof replaceValue === 'function';
	      if (!functionalReplace) replaceValue = String(replaceValue);

	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regexpExecAbstract(rx, S);
	        if (result === null) break;

	        results.push(result);
	        if (!global) break;

	        var matchStr = String(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = String(result[0]);
	        var position = max$3(min$3(toInteger(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = String(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];

	  // https://tc39.github.io/ecma262/#sec-getsubstitution
	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	    if (namedCaptures !== undefined) {
	      namedCaptures = toObject(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }
	    return nativeReplace.call(replacement, symbols, function (match, ch) {
	      var capture;
	      switch (ch.charAt(0)) {
	        case '$': return '$';
	        case '&': return matched;
	        case '`': return str.slice(0, position);
	        case "'": return str.slice(tailPos);
	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;
	        default: // \d\d?
	          var n = +ch;
	          if (n === 0) return match;
	          if (n > m) {
	            var f = floor$1(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }
	          capture = captures[n - 1];
	      }
	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	// `SameValue` abstract operation
	// https://tc39.github.io/ecma262/#sec-samevalue
	var sameValue = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

	// @@search logic
	fixRegexpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
	  return [
	    // `String.prototype.search` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.search
	    function search(regexp) {
	      var O = requireObjectCoercible(this);
	      var searcher = regexp == undefined ? undefined : regexp[SEARCH];
	      return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
	    },
	    // `RegExp.prototype[@@search]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
	    function (regexp) {
	      var res = maybeCallNative(nativeSearch, regexp, this);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);

	      var previousLastIndex = rx.lastIndex;
	      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
	      var result = regexpExecAbstract(rx, S);
	      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
	      return result === null ? -1 : result.index;
	    }
	  ];
	});

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

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

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _construct(Parent, args, Class) {
	  if (isNativeReflectConstruct()) {
	    _construct = Reflect.construct;
	  } else {
	    _construct = function _construct(Parent, args, Class) {
	      var a = [null];
	      a.push.apply(a, args);
	      var Constructor = Function.bind.apply(Parent, a);
	      var instance = new Constructor();
	      if (Class) _setPrototypeOf(instance, Class.prototype);
	      return instance;
	    };
	  }

	  return _construct.apply(null, arguments);
	}

	function _isNativeFunction(fn) {
	  return Function.toString.call(fn).indexOf("[native code]") !== -1;
	}

	function _wrapNativeSuper(Class) {
	  var _cache = typeof Map === "function" ? new Map() : undefined;

	  _wrapNativeSuper = function _wrapNativeSuper(Class) {
	    if (Class === null || !_isNativeFunction(Class)) return Class;

	    if (typeof Class !== "function") {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    if (typeof _cache !== "undefined") {
	      if (_cache.has(Class)) return _cache.get(Class);

	      _cache.set(Class, Wrapper);
	    }

	    function Wrapper() {
	      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
	    }

	    Wrapper.prototype = Object.create(Class.prototype, {
	      constructor: {
	        value: Wrapper,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	    return _setPrototypeOf(Wrapper, Class);
	  };

	  return _wrapNativeSuper(Class);
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _possibleConstructorReturn(self, call) {
	  if (call && (typeof call === "object" || typeof call === "function")) {
	    return call;
	  }

	  return _assertThisInitialized(self);
	}

	function _superPropBase(object, property) {
	  while (!Object.prototype.hasOwnProperty.call(object, property)) {
	    object = _getPrototypeOf(object);
	    if (object === null) break;
	  }

	  return object;
	}

	function _get(target, property, receiver) {
	  if (typeof Reflect !== "undefined" && Reflect.get) {
	    _get = Reflect.get;
	  } else {
	    _get = function _get(target, property, receiver) {
	      var base = _superPropBase(target, property);

	      if (!base) return;
	      var desc = Object.getOwnPropertyDescriptor(base, property);

	      if (desc.get) {
	        return desc.get.call(receiver);
	      }

	      return desc.value;
	    };
	  }

	  return _get(target, property, receiver || target);
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArrayLimit(arr, i) {
	  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
	    return;
	  }

	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance");
	}

	var MINYEAR = 1;
	var MAXYEAR = 9999;
	var DateTimeError =
	/*#__PURE__*/
	function (_Error) {
	  _inherits(DateTimeError, _Error);

	  function DateTimeError(message) {
	    var _this;

	    _classCallCheck(this, DateTimeError);

	    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateTimeError).call(this, message));
	    Object.defineProperty(_assertThisInitialized(_this), 'name', {
	      configurable: true,
	      enumerable: false,
	      value: _this.constructor.name,
	      writable: true
	    });

	    if (Error.captureStackTrace) {
	      Error.captureStackTrace(_assertThisInitialized(_this), _this.constructor);
	    }

	    return _this;
	  }

	  return DateTimeError;
	}(_wrapNativeSuper(Error));
	var NotImplementedDateTimeError =
	/*#__PURE__*/
	function (_DateTimeError) {
	  _inherits(NotImplementedDateTimeError, _DateTimeError);

	  function NotImplementedDateTimeError() {
	    _classCallCheck(this, NotImplementedDateTimeError);

	    return _possibleConstructorReturn(this, _getPrototypeOf(NotImplementedDateTimeError).call(this, "Not implemented."));
	  }

	  return NotImplementedDateTimeError;
	}(DateTimeError);
	var TypeDateTimeError =
	/*#__PURE__*/
	function (_DateTimeError2) {
	  _inherits(TypeDateTimeError, _DateTimeError2);

	  function TypeDateTimeError(parameterName, parameterValue, message) {
	    var _this2;

	    _classCallCheck(this, TypeDateTimeError);

	    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(TypeDateTimeError).call(this, message));
	    _this2.parameterName = parameterName;
	    _this2.parameterValue = parameterValue;
	    return _this2;
	  }

	  return TypeDateTimeError;
	}(DateTimeError);
	var ValueDateTimeError =
	/*#__PURE__*/
	function (_DateTimeError3) {
	  _inherits(ValueDateTimeError, _DateTimeError3);

	  function ValueDateTimeError(parameterName, parameterValue, message) {
	    var _this3;

	    _classCallCheck(this, ValueDateTimeError);

	    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(ValueDateTimeError).call(this, message));
	    _this3.parameterName = parameterName;
	    _this3.parameterValue = parameterValue;
	    return _this3;
	  }

	  return ValueDateTimeError;
	}(DateTimeError);
	var RangeDateTimeError =
	/*#__PURE__*/
	function (_ValueDateTimeError) {
	  _inherits(RangeDateTimeError, _ValueDateTimeError);

	  function RangeDateTimeError() {
	    _classCallCheck(this, RangeDateTimeError);

	    return _possibleConstructorReturn(this, _getPrototypeOf(RangeDateTimeError).apply(this, arguments));
	  }

	  return RangeDateTimeError;
	}(ValueDateTimeError);
	var stdDate = Function('return this')().Date; // "stdDate.UTC" converts years between 0 and 99 to a year in the 20th century.
	// Usually it can be avoided just adding setUTCFullYear(year)
	// after constructing the "stdDate" instance.
	// Buf if the parameters from month to milliseconds are outside of their
	// range, year can be updated to accommodate these values.
	// In this case, below function must be used.

	function safeStdDateUTC(year, month, day, hour, minute, second, millisecond) {
	  var d = new stdDate();
	  d.setUTCFullYear(year);
	  d.setUTCMonth(month - 1);
	  d.setUTCDate(day);
	  d.setUTCHours(hour);
	  d.setUTCMinutes(minute);
	  d.setUTCSeconds(second);
	  d.setUTCMilliseconds(millisecond);
	  return d;
	}

	var daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var leapedDaysPerMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	var totalDaysPerMonth = function () {
	  var sum = 0;
	  var ret = daysPerMonth.map(function (x) {
	    return sum += x;
	  });
	  ret.unshift(0);
	  return ret;
	}();

	var totalLeapedDaysPerMonth = function () {
	  var sum = 0;
	  var ret = leapedDaysPerMonth.map(function (x) {
	    return sum += x;
	  });
	  ret.unshift(0);
	  return ret;
	}();

	function divmod(a, b) {
	  var quotient = Math.floor(a / b);
	  return [quotient, a - quotient * b];
	}

	function zeroPad(integer, length) {
	  return integer.toString().padStart(length, '0');
	} // "timeDelta" must be "TimeDelta({hours: -24}) < timeDelta < 
	// TimeDelta({hours: 24})"


	function toOffsetString(timeDelta) {
	  var offset = timeDelta;
	  var minus = offset.days < 0;

	  if (minus) {
	    offset = neg(offset);
	  }

	  var seconds = offset.seconds % 60;
	  var totalMinutes = Math.floor(offset.seconds / 60);
	  var minutes = zeroPad(totalMinutes % 60, 2);
	  var hours = zeroPad(Math.floor(totalMinutes / 60), 2);
	  var ret = "".concat(minus ? '-' : '+').concat(hours, ":").concat(minutes);

	  if (offset.microseconds) {
	    ret += ":".concat(zeroPad(seconds, 2), ".").concat(zeroPad(offset.microseconds, 6));
	  } else if (seconds) {
	    ret += ":".concat(zeroPad(seconds, 2));
	  }

	  return ret;
	}

	function isLeapYear(year) {
	  if (year % 4 !== 0) return false;
	  if (year % 100 === 0 && year % 400 !== 0) return false;
	  return true;
	}

	function _strftime(dt, format) {
	  var a = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	  var A = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	  var b = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	  var B = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	  var ret = '';

	  for (var i = 0; i < format.length; ++i) {
	    if (format[i] !== '%' || i + 1 >= format.length) {
	      ret += format[i];
	      continue;
	    }

	    var s = void 0;

	    switch (format[i + 1]) {
	      case 'a':
	        s = a[dt.weekday()];
	        break;

	      case 'A':
	        s = A[dt.weekday()];
	        break;

	      case 'w':
	        s = ((dt.weekday() + 1) % 7).toString();
	        break;

	      case 'd':
	        s = zeroPad(dt.day, 2);
	        break;

	      case 'b':
	        s = b[dt.month - 1];
	        break;

	      case 'B':
	        s = B[dt.month - 1];
	        break;

	      case 'm':
	        s = zeroPad(dt.month, 2);
	        break;

	      case 'y':
	        s = zeroPad(dt.year % 100, 2);
	        break;

	      case 'Y':
	        s = zeroPad(dt.year, 4);
	        break;

	      case 'H':
	        s = zeroPad(dt.hour, 2);
	        break;

	      case 'I':
	        s = zeroPad(dt.hour % 12, 2);
	        break;

	      case 'p':
	        s = dt.hour < 12 ? 'AM' : 'PM';
	        break;

	      case 'M':
	        s = zeroPad(dt.minute, 2);
	        break;

	      case 'S':
	        s = zeroPad(dt.second, 2);
	        break;

	      case 'f':
	        s = zeroPad(dt.microsecond, 6);
	        break;

	      case 'z':
	        var offset = dt.utcOffset();
	        if (offset == null) s = '';else s = toOffsetString(offset).replace(':', '');
	        break;

	      case 'Z':
	        var tzName = dt.tzName();
	        if (tzName == null) s = '';else s = tzName;
	        break;

	      case '%':
	        s = '%';
	        break;
	    }

	    ret += s;
	    ++i;
	  }

	  return ret;
	}

	var TimeDelta =
	/*#__PURE__*/
	function () {
	  function TimeDelta() {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        _ref$days = _ref.days,
	        days = _ref$days === void 0 ? 0 : _ref$days,
	        _ref$seconds = _ref.seconds,
	        seconds = _ref$seconds === void 0 ? 0 : _ref$seconds,
	        _ref$microseconds = _ref.microseconds,
	        microseconds = _ref$microseconds === void 0 ? 0 : _ref$microseconds,
	        _ref$milliseconds = _ref.milliseconds,
	        milliseconds = _ref$milliseconds === void 0 ? 0 : _ref$milliseconds,
	        _ref$minutes = _ref.minutes,
	        minutes = _ref$minutes === void 0 ? 0 : _ref$minutes,
	        _ref$hours = _ref.hours,
	        hours = _ref$hours === void 0 ? 0 : _ref$hours,
	        _ref$weeks = _ref.weeks,
	        weeks = _ref$weeks === void 0 ? 0 : _ref$weeks;

	    _classCallCheck(this, TimeDelta);

	    microseconds += milliseconds * 1000;
	    seconds += minutes * 60;
	    seconds += hours * 3600;
	    days += weeks * 7;
	    var frac;

	    var _divmod = divmod(days, 1);

	    var _divmod2 = _slicedToArray(_divmod, 2);

	    days = _divmod2[0];
	    frac = _divmod2[1];
	    seconds += frac * 3600 * 24;

	    var _divmod3 = divmod(seconds, 1);

	    var _divmod4 = _slicedToArray(_divmod3, 2);

	    seconds = _divmod4[0];
	    frac = _divmod4[1];
	    microseconds += frac * Math.pow(1000, 2);
	    microseconds = Math.round(microseconds);
	    var div, mod;

	    var _divmod5 = divmod(microseconds, Math.pow(1000, 2));

	    var _divmod6 = _slicedToArray(_divmod5, 2);

	    div = _divmod6[0];
	    mod = _divmod6[1];
	    microseconds = mod;
	    seconds += div;

	    var _divmod7 = divmod(seconds, 3600 * 24);

	    var _divmod8 = _slicedToArray(_divmod7, 2);

	    div = _divmod8[0];
	    mod = _divmod8[1];
	    seconds = mod;
	    days += div;
	    if (days >= 1000000000 || days <= -1000000000) throw new RangeDateTimeError();
	    this._days = days;
	    this._seconds = seconds;
	    this._microseconds = microseconds;
	  }

	  _createClass(TimeDelta, [{
	    key: "totalSeconds",
	    value: function totalSeconds() {
	      return this.days * 3600 * 24 + this.seconds + this.microseconds / Math.pow(1000, 2);
	    }
	  }, {
	    key: "toString",
	    value: function toString() {
	      var ret = '';

	      if (this.days) {
	        ret += "".concat(this.days, " day(s), ");
	      }

	      var totalMinutes = Math.floor(this.seconds / 60);
	      ret += "".concat(Math.floor(totalMinutes / 60), ":").concat(zeroPad(totalMinutes % 60, 2), ":") + "".concat(zeroPad(this.seconds % 60, 2));

	      if (this.microseconds) {
	        ret += ".".concat(zeroPad(this.microseconds, 6));
	      }

	      return ret;
	    }
	  }, {
	    key: "valueOf",
	    value: function valueOf() {
	      return this.totalSeconds();
	    }
	  }, {
	    key: "days",
	    get: function get() {
	      return this._days;
	    }
	  }, {
	    key: "seconds",
	    get: function get() {
	      return this._seconds;
	    }
	  }, {
	    key: "microseconds",
	    get: function get() {
	      return this._microseconds;
	    }
	  }]);

	  return TimeDelta;
	}();
	TimeDelta.min = new TimeDelta({
	  days: -999999999
	});
	TimeDelta.max = new TimeDelta({
	  days: 999999999,
	  hours: 23,
	  minutes: 59,
	  seconds: 59,
	  microseconds: 999999
	});
	TimeDelta.resolution = new TimeDelta({
	  microseconds: 1
	});
	var Date$1 =
	/*#__PURE__*/
	function () {
	  function Date(year, month, day) {
	    _classCallCheck(this, Date);

	    if (year < MINYEAR || year > MAXYEAR) throw new RangeDateTimeError('year', year, '"year" should be between "MINYEAR" and "MAXYEAR"');
	    if (month < 1 || month > 12) throw new RangeDateTimeError('month', month, '"month" should be between 1 and 12');
	    if (day < 1 || day > (isLeapYear(year) ? leapedDaysPerMonth[month - 1] : daysPerMonth[month - 1])) throw new RangeDateTimeError('day', day, 'Invalid day for the year and month');
	    this._year = year;
	    this._month = month;
	    this._day = day;
	  }

	  _createClass(Date, [{
	    key: "toStdDate",
	    value: function toStdDate() {
	      var utc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	      var ret;

	      if (!utc) {
	        ret = new stdDate(this.year, this.month - 1, this.day);
	        ret.setFullYear(this.year);
	      } else {
	        ret = new stdDate(stdDate.UTC(this.year, this.month - 1, this.day));
	        ret.setUTCFullYear(this.year);
	      }

	      return ret;
	    }
	  }, {
	    key: "replace",
	    value: function replace(_ref2) {
	      var year = _ref2.year,
	          month = _ref2.month,
	          day = _ref2.day;
	      if (year === undefined) year = this.year;
	      if (month === undefined) month = this.month;
	      if (day === undefined) day = this.day;
	      return new Date(year, month, day);
	    }
	  }, {
	    key: "toOrdinal",
	    value: function toOrdinal() {
	      var totalDays = 0;
	      var lastYear = this.year - 1;
	      var nLeapYear = Math.floor(lastYear / 4) - Math.floor(lastYear / 100) + Math.floor(lastYear / 400);
	      totalDays += nLeapYear * 366 + (lastYear - nLeapYear) * 365;

	      if (isLeapYear(this.year)) {
	        totalDays += totalLeapedDaysPerMonth[this.month - 1];
	      } else {
	        totalDays += totalDaysPerMonth[this.month - 1];
	      }

	      totalDays += this.day;
	      return totalDays;
	    }
	  }, {
	    key: "weekday",
	    value: function weekday() {
	      return (this.toStdDate().getDay() + 6) % 7;
	    }
	  }, {
	    key: "isoFormat",
	    value: function isoFormat() {
	      return "".concat(zeroPad(this.year, 4), "-").concat(zeroPad(this.month, 2), "-").concat(zeroPad(this.day, 2));
	    }
	  }, {
	    key: "strftime",
	    value: function strftime(format) {
	      var dt = DateTime.combine(this, new Time());
	      return _strftime(dt, format);
	    }
	  }, {
	    key: "toString",
	    value: function toString() {
	      return this.isoFormat();
	    }
	  }, {
	    key: "valueOf",
	    value: function valueOf() {
	      return this.toOrdinal();
	    }
	  }, {
	    key: "year",
	    get: function get() {
	      return this._year;
	    }
	  }, {
	    key: "month",
	    get: function get() {
	      return this._month;
	    }
	  }, {
	    key: "day",
	    get: function get() {
	      return this._day;
	    }
	  }], [{
	    key: "fromStdDate",
	    value: function fromStdDate(d) {
	      var utc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	      if (!utc) return new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());else return new Date(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
	    }
	  }, {
	    key: "today",
	    value: function today() {
	      var today = new stdDate();
	      return Date.fromStdDate(today);
	    }
	  }, {
	    key: "fromOrdinal",
	    value: function fromOrdinal(ordinal) {
	      var q, r;
	      var year = 1,
	          month = 1,
	          day = 1;

	      var _divmod9 = divmod(ordinal - 1, 365 * 303 + 366 * 97);

	      var _divmod10 = _slicedToArray(_divmod9, 2);

	      q = _divmod10[0];
	      r = _divmod10[1];
	      year += q * 400;

	      var _divmod11 = divmod(r, 365 * 76 + 366 * 24);

	      var _divmod12 = _slicedToArray(_divmod11, 2);

	      q = _divmod12[0];
	      r = _divmod12[1];
	      year += q * 100;

	      var _divmod13 = divmod(r, 365 * 3 + 366 * 1);

	      var _divmod14 = _slicedToArray(_divmod13, 2);

	      q = _divmod14[0];
	      r = _divmod14[1];
	      year += q * 4;

	      var _divmod15 = divmod(r, 365);

	      var _divmod16 = _slicedToArray(_divmod15, 2);

	      q = _divmod16[0];
	      r = _divmod16[1];

	      if (q <= 2) {
	        // not a leap year
	        year += q;

	        for (month = 1; month <= 12 && r >= totalDaysPerMonth[month]; ++month) {
	        }

	        day += r - totalDaysPerMonth[month - 1];
	      } else {
	        // leap year
	        year += 3;
	        if (q === 4) r += 365;

	        for (month = 1; month <= 12 && r >= totalLeapedDaysPerMonth[month]; ++month) {
	        }

	        day += r - totalLeapedDaysPerMonth[month - 1];
	      }

	      return new Date(year, month, day);
	    }
	  }, {
	    key: "fromISOFormat",
	    value: function fromISOFormat(dateString) {
	      var match = /^(\d\d\d\d)-(\d\d)-(\d\d)$/.exec(dateString);
	      if (match == null) throw new ValueDateTimeError('dateString', dateString, 'invalid format');

	      var _match$slice$map = match.slice(1).map(Number),
	          _match$slice$map2 = _slicedToArray(_match$slice$map, 3),
	          year = _match$slice$map2[0],
	          month = _match$slice$map2[1],
	          day = _match$slice$map2[2];

	      return new Date(year, month, day);
	    }
	  }]);

	  return Date;
	}();
	Date$1.min = new Date$1(MINYEAR, 1, 1);
	Date$1.max = new Date$1(MAXYEAR, 12, 31);
	Date$1.resolution = new TimeDelta({
	  days: 1
	});
	var TZInfo =
	/*#__PURE__*/
	function () {
	  function TZInfo() {
	    _classCallCheck(this, TZInfo);
	  }

	  _createClass(TZInfo, [{
	    key: "utcOffset",
	    value: function utcOffset(dt) {
	      throw new NotImplementedDateTimeError();
	    }
	  }, {
	    key: "dst",
	    value: function dst(dt) {
	      throw new NotImplementedDateTimeError();
	    }
	  }, {
	    key: "tzName",
	    value: function tzName(dt) {
	      throw new NotImplementedDateTimeError();
	    }
	  }, {
	    key: "fromUTC",
	    value: function fromUTC(dt) {
	      if (dt.tzInfo !== this) {
	        throw new ValueDateTimeError('dt', dt);
	      }

	      var dtoff = dt.utcOffset();
	      var dtdst = dt.dst();

	      if (dtoff == null || dtdst == null) {
	        throw new ValueDateTimeError('dt', dt);
	      }

	      var delta = sub(dtoff, dtdst);

	      if (cmp(delta, new TimeDelta()) !== 0) {
	        dt = add(dt, delta);
	        dtdst = td.dst();
	      }

	      if (dtdst == null) return dt;else return add(dt, dtdst);
	    }
	  }]);

	  return TZInfo;
	}();
	var TimeZone =
	/*#__PURE__*/
	function (_TZInfo) {
	  _inherits(TimeZone, _TZInfo);

	  function TimeZone(offset) {
	    var _this4;

	    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	    _classCallCheck(this, TimeZone);

	    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(TimeZone).call(this));
	    if (!(cmp(new TimeDelta({
	      hours: -24
	    }), offset) < 0 && cmp(offset, new TimeDelta({
	      hours: 24
	    })) < 0)) throw new RangeDateTimeError('offset', offset, '"offset" must be "TimeDelta({hours: -24}) < offset < ' + 'TimeDelta({hours: 24})".');

	    if (name == null) {
	      name = 'UTC';

	      if (cmp(offset, new TimeDelta()) != 0) {
	        name += toOffsetString(offset);
	      }
	    }

	    _this4._offset = offset;
	    _this4._name = name;
	    return _this4;
	  }

	  _createClass(TimeZone, [{
	    key: "utcOffset",
	    value: function utcOffset(dt) {
	      return this._offset;
	    }
	  }, {
	    key: "tzName",
	    value: function tzName(dt) {
	      return this._name;
	    }
	  }, {
	    key: "dst",
	    value: function dst(dt) {
	      return null;
	    }
	  }, {
	    key: "fromUTC",
	    value: function fromUTC(dt) {
	      if (dt.tzInfo !== this) {
	        throw new ValueDateTimeError('dt', dt, '"dt.tzInfo" must be same instance as "this".');
	      }

	      return add(dt, this._offset);
	    }
	  }]);

	  return TimeZone;
	}(TZInfo);
	TimeZone.utc = new TimeZone(new TimeDelta({}));
	var LOCALTZINFO = new (
	/*#__PURE__*/
	function (_TZInfo2) {
	  _inherits(_class, _TZInfo2);

	  function _class() {
	    var _this5;

	    _classCallCheck(this, _class);

	    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
	    var stdOffset = -new stdDate(2000, 0, 1).getTimezoneOffset();
	    _this5._stdOffset = new TimeDelta({
	      minutes: stdOffset
	    });
	    return _this5;
	  }

	  _createClass(_class, [{
	    key: "utcOffset",
	    value: function utcOffset(dt) {
	      if (dt == null) return this._stdOffset;
	      var offset = -dt.toStdDate(false).getTimezoneOffset();
	      return new TimeDelta({
	        minutes: offset
	      });
	    }
	  }, {
	    key: "dst",
	    value: function dst(dt) {
	      if (dt == null) return new TimeDelta();
	      var offset = -dt.toStdDate(false).getTimezoneOffset();
	      offset = new TimeDelta({
	        minutes: offset
	      });
	      return sub(offset, this._stdOffset);
	    }
	  }, {
	    key: "tzName",
	    value: function tzName(dt) {
	      var offset = this.utcOffset(dt);
	      return toOffsetString(offset);
	    }
	  }, {
	    key: "fromUTC",
	    value: function fromUTC(dt) {
	      if (dt.tzInfo !== this) throw new ValueDateTimeError('dt', dt, '"dt.tzInfo" must be same instance as "this".');
	      var local = DateTime.fromStdDate(dt.toStdDate(true), false).replace({
	        microsecond: dt.microsecond,
	        tzInfo: this,
	        fold: 0
	      });
	      return local;
	    }
	  }]);

	  return _class;
	}(TZInfo))();
	var Time =
	/*#__PURE__*/
	function () {
	  function Time() {
	    var hour = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	    var minute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	    var second = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	    var microsecond = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
	    var tzInfo = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
	    var fold = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

	    _classCallCheck(this, Time);

	    if (hour < 0 || hour >= 24) throw new RangeDateTimeError('hour', hour, '"hour" should be between 0 and 23.');
	    if (minute < 0 || minute >= 60) throw new RangeDateTimeError('minute', minute, '"minute" should be between 0 and 59.');
	    if (second < 0 || second >= 60) throw new RangeDateTimeError('second', second, '"second" should be between 0 and 59.');
	    if (microsecond < 0 || microsecond >= 1000000) throw new RangeDateTimeError('microsecond', microsecond, '"microsecond" should be between 0 and 999999.');
	    if (fold !== 0 && fold !== 1) throw new RangeDateTimeError('fold', fold, '"fold" should be 0 or 1.');
	    this._hour = hour;
	    this._minute = minute;
	    this._second = second;
	    this._microsecond = microsecond;
	    this._tzInfo = tzInfo;
	    this._fold = fold;
	  }

	  _createClass(Time, [{
	    key: "replace",
	    value: function replace(_ref3) {
	      var hour = _ref3.hour,
	          minute = _ref3.minute,
	          second = _ref3.second,
	          microsecond = _ref3.microsecond,
	          tzInfo = _ref3.tzInfo,
	          fold = _ref3.fold;
	      // we have to distinguish null and undefined because tzInfo may be null
	      if (hour === undefined) hour = this.hour;
	      if (minute === undefined) minute = this.minute;
	      if (second === undefined) second = this.second;
	      if (microsecond === undefined) microsecond = this.microsecond;
	      if (tzInfo === undefined) tzInfo = this.tzInfo;
	      if (fold === undefined) fold = this.fold;
	      return new Time(hour, minute, second, microsecond, tzInfo, fold);
	    }
	  }, {
	    key: "isoFormat",
	    value: function isoFormat() {
	      var timeSpec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'auto';

	      if (timeSpec === 'auto') {
	        timeSpec = this.microsecond ? 'microseconds' : 'seconds';
	      }

	      var ret = '';

	      switch (timeSpec) {
	        case 'microseconds':
	        case 'milliseconds':
	          if (timeSpec === 'microseconds') ret = zeroPad(this.microsecond, 6) + ret;else ret = zeroPad(Math.floor(this.microsecond / 1000), 3) + ret;
	          ret = '.' + ret;

	        case 'seconds':
	          ret = ':' + zeroPad(this.second, 2) + ret;

	        case 'minutes':
	          ret = ':' + zeroPad(this.minute, 2) + ret;

	        case 'hours':
	          ret = zeroPad(this.hour, 2) + ret;
	          break;

	        default:
	          throw new ValueDateTimeError('timeSpec', timeSpec, '"timeSpec" should be either "auto", "microseconds", "milliseconds", ' + '"seconds", "minutes" or "hours"');
	      }

	      var offset = this.utcOffset();

	      if (offset != null) {
	        ret += toOffsetString(offset);
	      }

	      return ret;
	    }
	  }, {
	    key: "utcOffset",
	    value: function utcOffset() {
	      return this.tzInfo == null ? null : this.tzInfo.utcOffset(null);
	    }
	  }, {
	    key: "dst",
	    value: function dst() {
	      return this.tzInfo == null ? null : this.tzInfo.dst(null);
	    }
	  }, {
	    key: "tzName",
	    value: function tzName() {
	      return this.tzInfo == null ? null : this.tzInfo.tzName(null);
	    }
	  }, {
	    key: "strftime",
	    value: function strftime(format) {
	      var dt = DateTime.combine(new Date$1(1900, 1, 1), this);
	      return _strftime(dt, format);
	    }
	  }, {
	    key: "toString",
	    value: function toString() {
	      return this.isoFormat();
	    }
	  }, {
	    key: "hour",
	    get: function get() {
	      return this._hour;
	    }
	  }, {
	    key: "minute",
	    get: function get() {
	      return this._minute;
	    }
	  }, {
	    key: "second",
	    get: function get() {
	      return this._second;
	    }
	  }, {
	    key: "microsecond",
	    get: function get() {
	      return this._microsecond;
	    }
	  }, {
	    key: "tzInfo",
	    get: function get() {
	      return this._tzInfo;
	    }
	  }, {
	    key: "fold",
	    get: function get() {
	      return this._fold;
	    }
	  }], [{
	    key: "fromISOFormat",
	    value: function fromISOFormat(timeString) {
	      function parseTimeString(str) {
	        var match = /^(\d\d)(?:\:(\d\d)(?:\:(\d\d)(?:\.(\d{3})(\d{3})?)?)?)?$/.exec(str);
	        if (match == null) return null;
	        match.splice(0, 1);
	        var ret = match.map(function (x) {
	          return x == null ? 0 : parseInt(x, 10);
	        });
	        ret[3] = ret[3] * 1000 + ret[4];
	        ret.splice(4, 1);
	        return ret;
	      }

	      var sepIdx = timeString.search(/[+-]/);
	      if (sepIdx === -1) sepIdx = timeString.length;
	      var timeStr = timeString.slice(0, sepIdx);
	      var offsetStr = timeString.slice(sepIdx + 1);
	      var timeArray = parseTimeString(timeStr);
	      if (timeArray == null) throw new ValueDateTimeError('timeString', timeString, 'invalid format');
	      var tzInfo = null;

	      if (offsetStr !== '') {
	        var offsetArray = parseTimeString(offsetStr);

	        if (offsetArray == null) {
	          throw new ValueDateTimeError('timeString', timeString, 'invalid format');
	        }

	        var offset = new TimeDelta({
	          hours: offsetArray[0],
	          minutes: offsetArray[1],
	          seconds: offsetArray[2],
	          microseconds: offsetArray[3]
	        });
	        if (timeString[sepIdx] === '-') offset = neg(offset);
	        tzInfo = new TimeZone(offset);
	      }

	      return new Time(timeArray[0], timeArray[1], timeArray[2], timeArray[3], tzInfo);
	    }
	  }]);

	  return Time;
	}();
	Time.min = new Time(0, 0, 0, 0);
	Time.max = new Time(23, 59, 59, 999999);
	Time.resolution = new TimeDelta({
	  microseconds: 1
	});
	var DateTime =
	/*#__PURE__*/
	function (_Date) {
	  _inherits(DateTime, _Date);

	  function DateTime(year, month, day) {
	    var _this6;

	    var hour = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
	    var minute = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
	    var second = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
	    var microsecond = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
	    var tzInfo = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
	    var fold = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;

	    _classCallCheck(this, DateTime);

	    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(DateTime).call(this, year, month, day));
	    if (hour < 0 || hour >= 24) throw new RangeDateTimeError('hour', hour, '"hour" should be between 0 and 23.');
	    if (minute < 0 || minute >= 60) throw new RangeDateTimeError('minute', minute, '"minute" should be between 0 and 59.');
	    if (second < 0 || second >= 60) throw new RangeDateTimeError('second', second, '"second" should be between 0 and 59.');
	    if (microsecond < 0 || microsecond >= 1000000) throw new RangeDateTimeError('microsecond', microsecond, '"microsecond" should be between 0 and 999999.');
	    if (fold !== 0 && fold !== 1) throw new RangeDateTimeError('fold', fold, '"fold" should be 0 or 1.');
	    _this6._hour = hour;
	    _this6._minute = minute;
	    _this6._second = second;
	    _this6._microsecond = microsecond;
	    _this6._tzInfo = tzInfo;
	    _this6._fold = fold;
	    return _this6;
	  }

	  _createClass(DateTime, [{
	    key: "toStdDate",
	    value: function toStdDate() {
	      var utc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	      var ret;

	      if (!utc) {
	        ret = new stdDate(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.microsecond / 1000);
	        ret.setFullYear(this.year);
	      } else {
	        ret = new stdDate(stdDate.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.microsecond / 1000));
	        ret.setUTCFullYear(this.year);
	      }

	      return ret;
	    }
	  }, {
	    key: "date",
	    value: function date() {
	      return new Date$1(this.year, this.month, this.day);
	    }
	  }, {
	    key: "time",
	    value: function time() {
	      return new Time(this.hour, this.minute, this.second, this.microsecond, null, this.fold);
	    }
	  }, {
	    key: "timetz",
	    value: function timetz() {
	      return new Time(this.hour, this.minute, this.second, this.microsecond, this.tzInfo, this.fold);
	    }
	  }, {
	    key: "replace",
	    value: function replace(_ref4) {
	      var year = _ref4.year,
	          month = _ref4.month,
	          day = _ref4.day,
	          hour = _ref4.hour,
	          minute = _ref4.minute,
	          second = _ref4.second,
	          microsecond = _ref4.microsecond,
	          tzInfo = _ref4.tzInfo,
	          fold = _ref4.fold;

	      var newDate = _get(_getPrototypeOf(DateTime.prototype), "replace", this).call(this, {
	        year: year,
	        month: month,
	        day: day
	      }); // we have to distinguish null and undefined becase tzInfo may be null


	      if (hour === undefined) hour = this.hour;
	      if (minute === undefined) minute = this.minute;
	      if (second === undefined) second = this.second;
	      if (microsecond === undefined) microsecond = this.microsecond;
	      if (tzInfo === undefined) tzInfo = this.tzInfo;
	      if (fold === undefined) fold = this.fold;
	      return new DateTime(newDate.year, newDate.month, newDate.day, hour, minute, second, microsecond, tzInfo, fold);
	    }
	  }, {
	    key: "asTimeZone",
	    value: function asTimeZone() {
	      var tz = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	      if (this.tzInfo === tz) return this;
	      var offset = this.utcOffset();
	      if (offset == null && tz == null) return this;
	      var utc;

	      if (offset == null) {
	        var local = this.replace({
	          tzInfo: LOCALTZINFO
	        });
	        utc = sub(local, local.utcOffset());
	      } else {
	        utc = sub(this, offset);
	      }

	      var tmpTZ = tz != null ? tz : LOCALTZINFO;
	      var ret = tmpTZ.fromUTC(utc.replace({
	        tzInfo: tmpTZ
	      }));
	      return ret.replace({
	        tzInfo: tz
	      });
	    }
	  }, {
	    key: "utcOffset",
	    value: function utcOffset() {
	      return this.tzInfo == null ? null : this.tzInfo.utcOffset(this);
	    }
	  }, {
	    key: "dst",
	    value: function dst() {
	      return this.tzInfo == null ? null : this.tzInfo.dst(this);
	    }
	  }, {
	    key: "tzName",
	    value: function tzName() {
	      return this.tzInfo == null ? null : this.tzInfo.tzName(this);
	    }
	  }, {
	    key: "timeStamp",
	    value: function timeStamp() {
	      var dt = this;

	      if (this.utcOffset() == null) {
	        dt = this.replace({
	          tzInfo: LOCALTZINFO
	        });
	      }

	      return sub(dt, new DateTime(1970, 1, 1, 0, 0, 0, 0, TimeZone.utc)).totalSeconds();
	    }
	  }, {
	    key: "isoFormat",
	    value: function isoFormat() {
	      var sep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'T';
	      var timespec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';
	      return this.date().isoFormat() + sep + this.timetz().isoFormat(timespec);
	    }
	  }, {
	    key: "strftime",
	    value: function strftime(format) {
	      return _strftime(this, format);
	    }
	  }, {
	    key: "toString",
	    value: function toString() {
	      return this.isoFormat(' ');
	    }
	  }, {
	    key: "valueOf",
	    value: function valueOf() {
	      return this.timeStamp();
	    }
	  }, {
	    key: "hour",
	    get: function get() {
	      return this._hour;
	    }
	  }, {
	    key: "minute",
	    get: function get() {
	      return this._minute;
	    }
	  }, {
	    key: "second",
	    get: function get() {
	      return this._second;
	    }
	  }, {
	    key: "microsecond",
	    get: function get() {
	      return this._microsecond;
	    }
	  }, {
	    key: "tzInfo",
	    get: function get() {
	      return this._tzInfo;
	    }
	  }, {
	    key: "fold",
	    get: function get() {
	      return this._fold;
	    }
	  }], [{
	    key: "fromStdDate",
	    value: function fromStdDate(d) {
	      var utc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	      if (!utc) return new DateTime(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds() * 1000);else return new DateTime(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds() * 1000);
	    }
	  }, {
	    key: "today",
	    value: function today() {
	      return DateTime.fromStdDate(new stdDate());
	    }
	  }, {
	    key: "now",
	    value: function now() {
	      var tz = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	      if (tz == null) return DateTime.today();
	      return tz.fromUTC(DateTime.utcNow().replace({
	        tzInfo: tz
	      }));
	    }
	  }, {
	    key: "utcNow",
	    value: function utcNow() {
	      return DateTime.fromStdDate(new stdDate(), true);
	    }
	  }, {
	    key: "fromTimeStamp",
	    value: function fromTimeStamp(timeStamp) {
	      var tz = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	      if (tz == null) return DateTime.fromStdDate(new stdDate(timeStamp * 1000));
	      return tz.fromUTC(DateTime.utcFromTimeStamp(timeStamp).replace({
	        tzInfo: tz
	      }));
	    }
	  }, {
	    key: "utcFromTimeStamp",
	    value: function utcFromTimeStamp(timeStamp) {
	      return DateTime.fromStdDate(new stdDate(timeStamp * 1000), true);
	    }
	  }, {
	    key: "combine",
	    value: function combine(date, time) {
	      var tzInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
	      if (tzInfo === undefined) tzInfo = time.tzInfo;
	      return new DateTime(date.year, date.month, date.day, time.hour, time.minute, time.second, time.microsecond, tzInfo, time.fold);
	    }
	  }, {
	    key: "fromISOFormat",
	    value: function fromISOFormat(dateString) {
	      var dateStr = dateString.slice(0, 10);
	      var timeStr = dateString.slice(11);
	      return DateTime.combine(Date$1.fromISOFormat(dateStr), Time.fromISOFormat(timeStr));
	    }
	  }]);

	  return DateTime;
	}(Date$1);
	DateTime.min = new DateTime(MINYEAR, 1, 1);
	DateTime.max = new DateTime(MAXYEAR, 12, 31, 23, 59, 59, 999999);
	DateTime.resolution = new TimeDelta({
	  microseconds: 1
	});
	function add(a, b) {
	  function date_plus_timedelta(d, td) {
	    d = d.toStdDate();
	    d.setDate(d.getDate() + td.days);
	    return Date$1.fromStdDate(d);
	  }

	  function datetime_plus_timedelta(dt, td) {
	    var microseconds = divmod(dt.microsecond + td.microseconds, 1000);
	    var d = safeStdDateUTC(dt.year, dt.month, dt.day + td.days, dt.hour, dt.minute, dt.second + td.seconds, microseconds[0]);
	    var ret = DateTime.fromStdDate(d, true).replace({
	      tzInfo: dt.tzInfo
	    });
	    return ret.replace({
	      microsecond: ret.microsecond + microseconds[1]
	    });
	  }

	  if (a instanceof TimeDelta && b instanceof TimeDelta) {
	    return new TimeDelta({
	      days: a.days + b.days,
	      seconds: a.seconds + b.seconds,
	      microseconds: a.microseconds + b.microseconds
	    });
	  }

	  if (a instanceof DateTime && b instanceof TimeDelta) {
	    return datetime_plus_timedelta(a, b);
	  }

	  if (a instanceof TimeDelta && b instanceof DateTime) {
	    return datetime_plus_timedelta(b, a);
	  }

	  if (a instanceof Date$1 && b instanceof TimeDelta) {
	    return date_plus_timedelta(a, b);
	  }

	  if (a instanceof TimeDelta && b instanceof Date$1) {
	    return date_plus_timedelta(b, a);
	  }

	  throw new TypeError('Cannot add these two types.');
	}
	function sub(a, b) {
	  if (a instanceof TimeDelta && b instanceof TimeDelta) {
	    return new TimeDelta({
	      days: a.days - b.days,
	      seconds: a.seconds - b.seconds,
	      microseconds: a.microseconds - b.microseconds
	    });
	  }

	  if (a instanceof DateTime && b instanceof TimeDelta) {
	    var microseconds = divmod(a.microsecond - b.microseconds, 1000);
	    var d = safeStdDateUTC(a.year, a.month, a.day - b.days, a.hour, a.minute, a.second - b.seconds, microseconds[0]);
	    var ret = DateTime.fromStdDate(d, true).replace({
	      tzInfo: a.tzInfo
	    });
	    return ret.replace({
	      microsecond: ret.microsecond + microseconds[1]
	    });
	  }

	  if (a instanceof DateTime && b instanceof DateTime) {
	    var aOffset = a.utcOffset();
	    var bOffset = b.utcOffset();

	    if (!(aOffset == null && bOffset == null) && a.tzInfo !== b.tzInfo) {
	      if (aOffset == null || bOffset == null) throw new TypeError('Cannot subtract naive "DateTime" and aware "DateTime"');
	      a = sub(a, aOffset);
	      b = sub(b, bOffset);
	    }

	    var days = a.toOrdinal() - b.toOrdinal();
	    return new TimeDelta({
	      days: days,
	      hours: a.hour - b.hour,
	      minutes: a.minute - b.minute,
	      seconds: a.second - b.second,
	      microseconds: a.microsecond - b.microsecond
	    });
	  }

	  if (a instanceof Date$1 && b instanceof TimeDelta) {
	    var _d = a.toStdDate(true);

	    _d.setDate(_d.getDate() - b.days);

	    return Date$1.fromStdDate(_d, true);
	  }

	  if (a instanceof Date$1 && b instanceof Date$1) {
	    return new TimeDelta({
	      days: a.toOrdinal() - b.toOrdinal()
	    });
	  }

	  throw new TypeError('Cannnot subtract these two types.');
	}
	function neg(a) {
	  if (a instanceof TimeDelta) {
	    return new TimeDelta({
	      days: -a.days,
	      seconds: -a.seconds,
	      microseconds: -a.microseconds
	    });
	  }

	  throw new TypeError('Cannot negate this type.');
	}
	function cmp(a, b) {
	  function _comp(a, b) {
	    if (a === b) return 0;
	    if (a > b) return 1;
	    if (a < b) return -1;
	    throw new TypeError();
	  }

	  function subtractTimeDeltaFromTime(time, timeDelta) {
	    var totalMicroseconds = time.microsecond - timeDelta.microseconds;
	    var totalSeconds = time.second + time.minute * 60 + time.hour * 3600 - timeDelta.seconds;

	    var _divmod17 = divmod(totalMicroseconds, 1000000),
	        _divmod18 = _slicedToArray(_divmod17, 2),
	        q = _divmod18[0],
	        r = _divmod18[1];

	    var microsecond = r;

	    var _divmod19 = divmod(totalSeconds + q, 60);

	    var _divmod20 = _slicedToArray(_divmod19, 2);

	    q = _divmod20[0];
	    r = _divmod20[1];
	    var second = r;

	    var _divmod21 = divmod(q, 60);

	    var _divmod22 = _slicedToArray(_divmod21, 2);

	    q = _divmod22[0];
	    r = _divmod22[1];
	    var minute = r;

	    var _divmod23 = divmod(q, 24);

	    var _divmod24 = _slicedToArray(_divmod23, 2);

	    q = _divmod24[0];
	    r = _divmod24[1];
	    var hour = r;
	    return new Time(hour, minute, second, microsecond, null, time.fold);
	  }

	  if (a instanceof TimeDelta && b instanceof TimeDelta) {
	    var c = _comp(a.days, b.days);

	    if (c) return c;
	    c = _comp(a.seconds, b.seconds);
	    if (c) return c;
	    c = _comp(a.microseconds, b.microseconds);
	    return c;
	  }

	  if (a instanceof DateTime && b instanceof DateTime) {
	    var aOffset = a.utcOffset();
	    var bOffset = b.utcOffset();

	    if (!(aOffset == null && bOffset == null) && a.tzInfo !== b.tzInfo) {
	      if (aOffset == null || bOffset == null) throw new TypeError('Cannot compare naive "DateTime" to aware "DateTime"');
	      a = sub(a, aOffset);
	      b = sub(b, bOffset);
	    }

	    var _c = _comp(a.year, b.year);

	    if (_c) return _c;
	    _c = _comp(a.month, b.month);
	    if (_c) return _c;
	    _c = _comp(a.day, b.day);
	    if (_c) return _c;
	    _c = _comp(a.hour, b.hour);
	    if (_c) return _c;
	    _c = _comp(a.minute, b.minute);
	    if (_c) return _c;
	    _c = _comp(a.second, b.second);
	    if (_c) return _c;
	    _c = _comp(a.microsecond, b.microsecond);
	    if (_c) return _c;
	    _c = _comp(a.fold, b.fold);
	    return _c;
	  }

	  if (a instanceof Date$1 && b instanceof Date$1) {
	    return _comp(a.toOrdinal(), b.toOrdinal());
	  }

	  if (a instanceof Time && b instanceof Time) {
	    var _aOffset = a.utcOffset();

	    var _bOffset = b.utcOffset();

	    if (!(_aOffset == null && _bOffset == null) && a.tzInfo !== b.tzInfo) {
	      if (_aOffset == null || _bOffset == null) throw new TypeError('Cannot compare naive "Time" object to aware "Time" object');
	      a = subtractTimeDeltaFromTime(a, _aOffset);
	      b = subtractTimeDeltaFromTime(b, _bOffset);
	    }

	    var _c2 = _comp(a.hour, b.hour);

	    if (_c2) return _c2;
	    _c2 = _comp(a.minute, b.minute);
	    if (_c2) return _c2;
	    _c2 = _comp(a.second, b.second);
	    if (_c2) return _c2;
	    _c2 = _comp(a.microsecond, b.microsecond);
	    if (_c2) return _c2;
	    _c2 = _comp(a.fold, b.fold);
	    return _c2;
	  }

	  throw new TypeError('Cannot compare these two types.');
	}

	exports.Date = Date$1;
	exports.DateTime = DateTime;
	exports.DateTimeError = DateTimeError;
	exports.LOCALTZINFO = LOCALTZINFO;
	exports.MAXYEAR = MAXYEAR;
	exports.MINYEAR = MINYEAR;
	exports.NotImplementedDateTimeError = NotImplementedDateTimeError;
	exports.RangeDateTimeError = RangeDateTimeError;
	exports.TZInfo = TZInfo;
	exports.Time = Time;
	exports.TimeDelta = TimeDelta;
	exports.TimeZone = TimeZone;
	exports.TypeDateTimeError = TypeDateTimeError;
	exports.ValueDateTimeError = ValueDateTimeError;
	exports.add = add;
	exports.cmp = cmp;
	exports.neg = neg;
	exports.sub = sub;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
