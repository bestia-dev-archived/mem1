(function() {
    const __exports = {};
    let wasm;

    /**
    * @returns {void}
    */
    __exports.run = function() {
        return wasm.run();
    };

    let cachedTextDecoder = new TextDecoder('utf-8');

    let cachegetUint8Memory = null;
    function getUint8Memory() {
        if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory;
    }

    function getStringFromWasm(ptr, len) {
        return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
    }

    __exports.__wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
        let varg0 = getStringFromWasm(arg0, arg1);

        varg0 = varg0.slice();
        wasm.__wbindgen_free(arg0, arg1 * 1);

        console.error(varg0);
    };

    const heap = new Array(32);

    heap.fill(undefined);

    heap.push(undefined, null, true, false);

    let heap_next = heap.length;

    function addHeapObject(obj) {
        if (heap_next === heap.length) heap.push(heap.length + 1);
        const idx = heap_next;
        heap_next = heap[idx];

        heap[idx] = obj;
        return idx;
    }

    __exports.__wbg_new_59cb74e423758ede = function() {
        return addHeapObject(new Error());
    };

function getObject(idx) { return heap[idx]; }

let cachedTextEncoder = new TextEncoder('utf-8');

let WASM_VECTOR_LEN = 0;

let passStringToWasm;
if (typeof cachedTextEncoder.encodeInto === 'function') {
    passStringToWasm = function(arg) {

        let size = arg.length;
        let ptr = wasm.__wbindgen_malloc(size);
        let writeOffset = 0;
        while (true) {
            const view = getUint8Memory().subarray(ptr + writeOffset, ptr + size);
            const { read, written } = cachedTextEncoder.encodeInto(arg, view);
            arg = arg.substring(read);
            writeOffset += written;
            if (arg.length === 0) {
                break;
            }
            ptr = wasm.__wbindgen_realloc(ptr, size, size * 2);
            size *= 2;
        }
        WASM_VECTOR_LEN = writeOffset;
        return ptr;
    };
} else {
    passStringToWasm = function(arg) {

        const buf = cachedTextEncoder.encode(arg);
        const ptr = wasm.__wbindgen_malloc(buf.length);
        getUint8Memory().set(buf, ptr);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    };
}

let cachegetUint32Memory = null;
function getUint32Memory() {
    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory;
}

__exports.__wbg_stack_558ba5917b466edd = function(ret, arg0) {

    const retptr = passStringToWasm(getObject(arg0).stack);
    const retlen = WASM_VECTOR_LEN;
    const mem = getUint32Memory();
    mem[ret / 4] = retptr;
    mem[ret / 4 + 1] = retlen;

};

__exports.__wbg_new_3a746f2619705add = function(arg0, arg1) {
    let varg0 = getStringFromWasm(arg0, arg1);
    return addHeapObject(new Function(varg0));
};

__exports.__wbg_call_f54d3a6dadb199ca = function(arg0, arg1) {
    return addHeapObject(getObject(arg0).call(getObject(arg1)));
};

__exports.__wbg_self_ac379e780a0d8b94 = function(arg0) {
    return addHeapObject(getObject(arg0).self);
};

__exports.__wbg_crypto_1e4302b85d4f64a2 = function(arg0) {
    return addHeapObject(getObject(arg0).crypto);
};

__exports.__wbg_getRandomValues_1b4ba144162a5c9e = function(arg0) {
    return addHeapObject(getObject(arg0).getRandomValues);
};

function getArrayU8FromWasm(ptr, len) {
    return getUint8Memory().subarray(ptr / 1, ptr / 1 + len);
}

__exports.__wbg_getRandomValues_1ef11e888e5228e9 = function(arg0, arg1, arg2) {
    let varg1 = getArrayU8FromWasm(arg1, arg2);
    getObject(arg0).getRandomValues(varg1);
};

__exports.__wbg_require_6461b1e9a0d7c34a = function(arg0, arg1) {
    let varg0 = getStringFromWasm(arg0, arg1);
    return addHeapObject(require(varg0));
};

__exports.__wbg_randomFillSync_1b52c8482374c55b = function(arg0, arg1, arg2) {
    let varg1 = getArrayU8FromWasm(arg1, arg2);
    getObject(arg0).randomFillSync(varg1);
};

__exports.__wbg_new_5ad3a30fd27500e6 = function(arg0) {
    return addHeapObject(new ChangeList(getObject(arg0)));
};

__exports.__wbg_unmount_b22efc123ce84986 = function(arg0) {
    getObject(arg0).unmount();
};

__exports.__wbg_addChangeListRange_5ae137ae4740d377 = function(arg0, arg1, arg2) {
    getObject(arg0).addChangeListRange(arg1, arg2);
};

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

__exports.__wbg_applyChanges_80aff4692bcb5634 = function(arg0, arg1) {
    getObject(arg0).applyChanges(takeObject(arg1));
};

__exports.__wbg_initEventsTrampoline_9d78568a584c1580 = function(arg0, arg1) {
    getObject(arg0).initEventsTrampoline(getObject(arg1));
};

function handleError(exnptr, e) {
    const view = getUint32Memory();
    view[exnptr / 4] = 1;
    view[exnptr / 4 + 1] = addHeapObject(e);
}

__exports.__widl_f_create_element_Document = function(arg0, arg1, arg2, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    try {
        return addHeapObject(getObject(arg0).createElement(varg1));
    } catch (e) {
        handleError(exnptr, e);
    }
};

function isLikeNone(x) {
    return x === undefined || x === null;
}

__exports.__widl_f_body_Document = function(arg0) {

    const val = getObject(arg0).body;
    return isLikeNone(val) ? 0 : addHeapObject(val);

};

__exports.__widl_f_id_Element = function(ret, arg0) {

    const retptr = passStringToWasm(getObject(arg0).id);
    const retlen = WASM_VECTOR_LEN;
    const mem = getUint32Memory();
    mem[ret / 4] = retptr;
    mem[ret / 4 + 1] = retlen;

};

__exports.__widl_f_set_inner_html_Element = function(arg0, arg1, arg2) {
    let varg1 = getStringFromWasm(arg1, arg2);
    getObject(arg0).innerHTML = varg1;
};

__exports.__widl_f_target_Event = function(arg0) {

    const val = getObject(arg0).target;
    return isLikeNone(val) ? 0 : addHeapObject(val);

};

__exports.__widl_instanceof_HTMLImageElement = function(idx) { return getObject(idx) instanceof HTMLImageElement ? 1 : 0; };

__exports.__widl_f_append_child_Node = function(arg0, arg1, exnptr) {
    try {
        return addHeapObject(getObject(arg0).appendChild(getObject(arg1)));
    } catch (e) {
        handleError(exnptr, e);
    }
};

__exports.__widl_instanceof_Window = function(idx) { return getObject(idx) instanceof Window ? 1 : 0; };

__exports.__widl_f_request_animation_frame_Window = function(arg0, arg1, exnptr) {
    try {
        return getObject(arg0).requestAnimationFrame(getObject(arg1));
    } catch (e) {
        handleError(exnptr, e);
    }
};

__exports.__widl_f_document_Window = function(arg0) {

    const val = getObject(arg0).document;
    return isLikeNone(val) ? 0 : addHeapObject(val);

};

__exports.__wbg_eval_4bb04065cad06014 = function(arg0, arg1, exnptr) {
    let varg0 = getStringFromWasm(arg0, arg1);
    try {
        return addHeapObject(eval(varg0));
    } catch (e) {
        handleError(exnptr, e);
    }
};

__exports.__wbg_newnoargs_b4526aa2a6db81de = function(arg0, arg1) {
    let varg0 = getStringFromWasm(arg0, arg1);
    return addHeapObject(new Function(varg0));
};

__exports.__wbg_call_a7a8823c404228ab = function(arg0, arg1, exnptr) {
    try {
        return addHeapObject(getObject(arg0).call(getObject(arg1)));
    } catch (e) {
        handleError(exnptr, e);
    }
};

__exports.__wbg_call_e6e8911c46484a33 = function(arg0, arg1, arg2, exnptr) {
    try {
        return addHeapObject(getObject(arg0).call(getObject(arg1), getObject(arg2)));
    } catch (e) {
        handleError(exnptr, e);
    }
};

__exports.__wbg_new_7440491cc5e719b8 = function(arg0, arg1) {
    let cbarg0 = function(arg0, arg1) {
        let a = this.a;
        this.a = 0;
        try {
            return this.f(a, this.b, addHeapObject(arg0), addHeapObject(arg1));

        } finally {
            this.a = a;

        }

    };
    cbarg0.f = wasm.__wbg_function_table.get(142);
    cbarg0.a = arg0;
    cbarg0.b = arg1;
    try {
        return addHeapObject(new Promise(cbarg0.bind(cbarg0)));
    } finally {
        cbarg0.a = cbarg0.b = 0;

    }
};

__exports.__wbg_resolve_ec1f85083faa6c47 = function(arg0) {
    return addHeapObject(Promise.resolve(getObject(arg0)));
};

__exports.__wbg_then_f1813c1d50cb0b3d = function(arg0, arg1) {
    return addHeapObject(getObject(arg0).then(getObject(arg1)));
};

__exports.__wbg_then_37317e38a820e922 = function(arg0, arg1, arg2) {
    return addHeapObject(getObject(arg0).then(getObject(arg1), getObject(arg2)));
};

__exports.__wbindgen_is_undefined = function(i) { return getObject(i) === undefined ? 1 : 0; };

__exports.__wbindgen_debug_string = function(i, len_ptr) {
    const debug_str =
    val => {
        // primitive types
        const type = typeof val;
        if (type == 'number' || type == 'boolean' || val == null) {
            return  `${val}`;
        }
        if (type == 'string') {
            return `"${val}"`;
        }
        if (type == 'symbol') {
            const description = val.description;
            if (description == null) {
                return 'Symbol';
            } else {
                return `Symbol(${description})`;
            }
        }
        if (type == 'function') {
            const name = val.name;
            if (typeof name == 'string' && name.length > 0) {
                return `Function(${name})`;
            } else {
                return 'Function';
            }
        }
        // objects
        if (Array.isArray(val)) {
            const length = val.length;
            let debug = '[';
            if (length > 0) {
                debug += debug_str(val[0]);
            }
            for(let i = 1; i < length; i++) {
                debug += ', ' + debug_str(val[i]);
            }
            debug += ']';
            return debug;
        }
        // Test for built-in
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches.length > 1) {
            className = builtInMatches[1];
        } else {
            // Failed to match the standard '[object ClassName]'
            return toString.call(val);
        }
        if (className == 'Object') {
            // we're a user defined class or Object
            // JSON.stringify avoids problems with cycles, and is generally much
            // easier than looping through ownProperties of `val`.
            try {
                return 'Object(' + JSON.stringify(val) + ')';
            } catch (_) {
                return 'Object';
            }
        }
        // errors
        if (val instanceof Error) {
        return `${val.name}: ${val.message}
        ${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
;
const toString = Object.prototype.toString;
const val = getObject(i);
const debug = debug_str(val);
const ptr = passStringToWasm(debug);
getUint32Memory()[len_ptr / 4] = WASM_VECTOR_LEN;
return ptr;
};

__exports.__wbindgen_cb_drop = function(i) {
    const obj = takeObject(i).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return 1;
    }
    return 0;
};

__exports.__wbindgen_jsval_eq = function(a, b) { return getObject(a) === getObject(b) ? 1 : 0; };

__exports.__wbindgen_memory = function() { return addHeapObject(wasm.memory); };

__exports.__wbindgen_throw = function(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
};

__exports.__wbindgen_closure_wrapper236 = function(a, b, _ignored) {
    const f = wasm.__wbg_function_table.get(99);
    const d = wasm.__wbg_function_table.get(100);
    const cb = function() {
        this.cnt++;
        let a = this.a;
        this.a = 0;
        try {
            return f(a, b);

        } finally {
            if (--this.cnt === 0) d(a, b);
            else this.a = a;

        }

    };
    cb.a = a;
    cb.cnt = 1;
    let real = cb.bind(cb);
    real.original = cb;
    return addHeapObject(real);
};

__exports.__wbindgen_closure_wrapper238 = function(a, b, _ignored) {
    const f = wasm.__wbg_function_table.get(103);
    const d = wasm.__wbg_function_table.get(100);
    const cb = function(arg0, arg1, arg2) {
        this.cnt++;
        try {
            return f(this.a, b, addHeapObject(arg0), arg1, arg2);

        } finally {
        if (--this.cnt === 0) { d(this.a, b); this.a = 0; }

    }

};
cb.a = a;
cb.cnt = 1;
let real = cb.bind(cb);
real.original = cb;
return addHeapObject(real);
};

__exports.__wbindgen_closure_wrapper396 = function(a, b, _ignored) {
    const f = wasm.__wbg_function_table.get(116);
    const d = wasm.__wbg_function_table.get(117);
    const cb = function(arg0) {
        this.cnt++;
        let a = this.a;
        this.a = 0;
        try {
            return f(a, b, addHeapObject(arg0));

        } finally {
            if (--this.cnt === 0) d(a, b);
            else this.a = a;

        }

    };
    cb.a = a;
    cb.cnt = 1;
    let real = cb.bind(cb);
    real.original = cb;
    return addHeapObject(real);
};

__exports.__wbindgen_object_clone_ref = function(idx) {
    return addHeapObject(getObject(idx));
};

__exports.__wbindgen_object_drop_ref = function(i) { dropObject(i); };

function init(module_or_path, maybe_memory) {
    let result;
    const imports = { './mem1': __exports };
    if (module_or_path instanceof URL || typeof module_or_path === 'string' || module_or_path instanceof Request) {

        const response = fetch(module_or_path);
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            result = WebAssembly.instantiateStreaming(response, imports)
            .catch(e => {
                console.warn("`WebAssembly.instantiateStreaming` failed. Assuming this is because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                return response
                .then(r => r.arrayBuffer())
                .then(bytes => WebAssembly.instantiate(bytes, imports));
            });
        } else {
            result = response
            .then(r => r.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, imports));
        }
    } else {

        result = WebAssembly.instantiate(module_or_path, imports)
        .then(instance => {
            return { instance, module: module_or_path };
        });
    }
    return result.then(({instance, module}) => {
        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;
        wasm.__wbindgen_start();
        return wasm;
    });
}

self.wasm_bindgen = Object.assign(init, __exports);

})();
