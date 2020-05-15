var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from "react";
export class Hook {
    constructor(props) {
        this.update = noop;
        this.props = props;
        this.state = this.initialState(props);
        this.bait = Object.assign(Object.assign({}, this.getActions()), this.state);
    }
    setState(update) {
        if (this.hasStateChanged(update, this.state)) {
            this.state = Object.assign(Object.assign({}, this.state), update);
            this.bait = Object.assign(Object.assign({}, this.bait), this.state);
            this.update();
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    initialState(props) { return {}; }
    getActions() { return {}; }
    onMount() { return; }
    onUnmount() { return; }
    onRender() { return; }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onChange(prevProps, newProps) { return; }
    watchProps() {
        return Object.keys(this.props);
    }
    havePropsChanged(prev, props, watch) {
        return watch.some(key => prev[key] !== props[key]);
    }
    hasStateChanged(update, state) {
        return Object.keys(state).some(key => update[key] !== state[key]);
    }
}
export function createHook(HookClass) {
    // this `wrapper = { [name]: hookFn }` stuff looks a little nuts but
    // it ensures that the hook function is actually named after the store class
    const name = `use${HookClass.name || "Hook"}`;
    const wrapper = {
        [name]: (props = {}) => {
            const [, forceUpdate] = React.useState(Number.MIN_VALUE);
            const ref = React.useRef(null);
            // initialize the HookClass and call it's onMount() method
            if (!ref.current) {
                const instance = new HookClass(props);
                const update = () => forceUpdate(k => k + Number.EPSILON);
                ref.current = {
                    instance,
                    update,
                    props: {},
                    watch: instance.watchProps(),
                };
                instance.onMount();
            }
            const self = ref.current;
            // make update a noop while we're already in the update section
            // to prevent additional, unneccessary rerenders
            self.instance.update = noop;
            // watch for changing props and call HookClass's onChange() with previous props
            self.instance.props = props;
            if (self.instance.havePropsChanged(self.props, props, self.watch))
                self.instance.onChange(self.props, props);
            self.props = props;
            // call HookClass's onUnmount() for cleanup
            React.useEffect(() => () => {
                // turn update into noop
                self.instance.update = noop;
                self.instance.onUnmount();
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, []);
            self.instance.onRender();
            // restore update back into real update method
            self.instance.update = self.update;
            return self.instance.bait;
        }
    };
    return wrapper[name];
}
export function createSharedHook(HookClass) {
    const useSharedHook = createHook(HookClass);
    const sharedHookContext = React.createContext({});
    const { Provider } = sharedHookContext;
    return [
        (_a) => {
            var { children } = _a, props = __rest(_a, ["children"]);
            const bait = useSharedHook(props);
            return React.createElement(Provider, { value: bait }, children);
        },
        () => React.useContext(sharedHookContext),
    ];
}
function noop() { return null; }
