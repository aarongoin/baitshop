(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
    (global = global || self, factory(global.baitshop = {}, global.React));
}(this, (function (exports, React) { 'use strict';

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
                const [, forceUpdate] = React.useState(Number.MIN_VALUE);
                const ref = React.useRef(null);
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
                React.useEffect(() => () => {
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
        const sharedHookContext = React.createContext({});
        const { Provider } = sharedHookContext;
        return [
            (_a) => {
                var { children } = _a, props = __rest(_a, ["children"]);
                const bait = useSharedHook(props);
                return React.createElement(Provider, { value: bait }, children);
            },
            () => React.useContext(sharedHookContext)
        ];
    }

    exports.Hook = Hook;
    exports.createHook = createHook;
    exports.createSharedHook = createSharedHook;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
