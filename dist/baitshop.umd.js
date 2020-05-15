(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(exports, require("react"))
    : typeof define === "function" && define.amd
    ? define(["exports", "react"], factory)
    : ((global = global || self),
      factory((global.baitshop = {}), global.React));
})(this, function(exports, React) {
  "use strict";

  function __rest(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  }

  class Hook {
    constructor(props) {
      this.update = noop;
      this.props = props;
      this.state = this.initialState(props);
      this.bait = Object.assign(
        Object.assign({}, this.getActions()),
        this.state
      );
    }
    setState(update) {
      if (this.hasStateChanged(update, this.state)) {
        this.state = Object.assign(Object.assign({}, this.state), update);
        this.bait = Object.assign(Object.assign({}, this.bait), this.state);
        this.update();
      }
    }
    initialState(props) {
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
    onChange(prevProps, newProps) {
      return;
    }
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
            props: {},
            watch: instance.watchProps()
          };
          instance.onMount();
        }
        const self = ref.current;
        self.instance.update = noop;
        self.instance.props = props;
        if (self.instance.havePropsChanged(self.props, props, self.watch))
          self.instance.onChange(self.props, props);
        self.props = props;
        React.useEffect(
          () => () => {
            self.instance.update = noop;
            self.instance.onUnmount();
          },
          []
        );
        self.instance.onRender();
        self.instance.update = self.update;
        return self.instance.bait;
      }
    };
    return wrapper[name];
  }
  function createSharedHook(HookClass) {
    const useSharedHook = createHook(HookClass);
    const sharedHookContext = React.createContext({});
    const { Provider } = sharedHookContext;
    return [
      _a => {
        var { children } = _a,
          props = __rest(_a, ["children"]);
        const bait = useSharedHook(props);
        return React.createElement(Provider, { value: bait }, children);
      },
      () => React.useContext(sharedHookContext)
    ];
  }
  function noop() {
    return null;
  }

  exports.Hook = Hook;
  exports.createHook = createHook;
  exports.createSharedHook = createSharedHook;

  Object.defineProperty(exports, "__esModule", { value: true });
});
