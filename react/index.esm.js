import { useState, useRef, useEffect, createContext, createElement, useContext } from 'react';

function noop() {
    return null;
}

class Hook {
    constructor(props) {
        this.update = noop;
        this.props = props;
        this.state = this.getInitialState();
        this.bait = Object.assign(Object.assign({}, this.getActions()), this.state);
    }
    setState(update) {
        if (this.didStateChange(update)) {
            this.state = Object.assign(Object.assign({}, this.state), update);
            this.bait = Object.assign(Object.assign({}, this.bait), this.state);
            this.update();
        }
    }
    getInitialState() {
        return {};
    }
    getActions() {
        return {};
    }
    onMount() {
        return;
    }
    onUnmount() {
        return;
    }
    onRender() {
        return;
    }
    onChange(prevProps) {
        return;
    }
    didPropsChange(prev) {
        return Object.keys(this.props).some(key => prev[key] !== this.props[key]);
    }
    didStateChange(update) {
        return Object.keys(update).some(key => update[key] !== this.state[key]);
    }
}

function createHook(HookClass) {
    const name = `use${HookClass.name || "Hook"}`;
    const wrapper = {
        [name]: (props = {}) => {
            const [, forceUpdate] = useState(Number.MIN_VALUE);
            const ref = useRef(null);
            if (!ref.current) {
                const instance = new HookClass(props);
                const update = () => forceUpdate(k => k + Number.EPSILON);
                ref.current = {
                    instance,
                    update,
                    props: {}
                };
                instance.onMount();
            }
            const self = ref.current;
            self.instance.update = noop;
            self.instance.props = props;
            if (self.instance.didPropsChange(self.props))
                self.instance.onChange(self.props);
            self.props = props;
            useEffect(() => () => {
                self.instance.update = noop;
                self.instance.onUnmount();
            },
            []);
            self.instance.onRender();
            self.instance.update = self.update;
            return self.instance.bait;
        }
    };
    return wrapper[name];
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function createSharedHook(HookClass) {
    const useSharedHook = createHook(HookClass);
    const sharedHookContext = createContext({});
    const { Provider } = sharedHookContext;
    return [
        (_a) => {
            var { children } = _a, props = __rest(_a, ["children"]);
            const bait = useSharedHook(props);
            return createElement(Provider, { value: bait }, children);
        },
        () => useContext(sharedHookContext)
    ];
}

export { Hook, createHook, createSharedHook };
