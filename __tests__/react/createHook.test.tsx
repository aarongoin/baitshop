import * as React from "react";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Hook, createHook } from "../../react";

jest.useFakeTimers();

describe("createHook", () => {
  test("returns a hook named after the class passed in", () => {
    expect(createHook(Hook).name).toBe("useHook");

    class MySuperAwesomeHook extends Hook {}
    expect(createHook(MySuperAwesomeHook).name).toBe("useMySuperAwesomeHook");
  });

  test("runs lifecycle methods in correct order and with correct arguments", () => {
    const calls: string[] = [];
    type Props = { foo: string };
    class TestHook extends Hook<Props> {
      constructor(props: Props) {
        super(props);
        calls.push(`constructor ${props.foo}`);
      }
      getInitialState() {
        calls.push("getInitialState");
        return super.getInitialState();
      }
      getActions() {
        calls.push("getActions");
        return super.getActions();
      }
      onMount() {
        calls.push("onMount");
        return super.onMount();
      }
      didPropsChange(prev: Props) {
        calls.push(`didPropsChange ${prev.foo}->${this.props.foo}`);
        return super.didPropsChange(prev);
      }
      onChange(prev: Props) {
        calls.push(`onChange ${prev.foo}->${this.props.foo}`);
        return super.onChange(prev);
      }
      onRender() {
        calls.push("onRender");
        return super.onRender();
      }
      onUnmount() {
        calls.push("onUnmount");
        return super.onUnmount();
      }
    }
    const useTestHook = createHook(TestHook);

    function HookTester(props: Props) {
      useTestHook(props);
      return null;
    }

    const { rerender } = render(
      <div>
        <HookTester foo="foo" />
      </div>
    );
    rerender(
      <div>
        <HookTester foo="bar" />
      </div>
    );
    rerender(<div></div>);

    expect(calls).toStrictEqual([
      "getInitialState",
      "getActions",
      "constructor foo",
      "onMount",
      "didPropsChange undefined->foo",
      "onChange undefined->foo",
      "onRender",
      "didPropsChange foo->bar",
      "onChange foo->bar",
      "onRender",
      "onUnmount"
    ]);
  });

  test("update() is a noop while inside hook body", () => {
    jest.clearAllMocks();
    type Props = { foo: string };
    type State = { bar: string };
    class TestHook extends Hook<Props, State> {
      constructor(props: Props) {
        super(props);
        this.update();
      }
      onMount() {
        this.update();
      }
      onRender() {
        this.setState({ bar: "foo" });
      }
    }

    const useTestHook = createHook(TestHook);

    function HookTester(props: Props) {
      useTestHook(props);
      return null;
    }

    render(<HookTester foo="foo" />);
    // expect(shared.noop).toHaveBeenCalledTimes(3); // TODO: fixme
  });

  test("update() is a noop when hook is unmounted", () => {
    jest.clearAllMocks();
    type Props = { foo: string };
    class TestHook extends Hook<Props> {
      onUnmount() {
        this.update();
      }
    }

    const useTestHook = createHook(TestHook);

    function HookTester(props: Props) {
      useTestHook(props);
      return null;
    }

    const { rerender } = render(
      <div>
        <HookTester foo="foo" />
      </div>
    );
    rerender(<div></div>);

    // expect(shared.noop).toHaveBeenCalledTimes(1); // TODO: fixme
  });

  test("update() will trigger rerender of component", () => {
    type Props = { foo: string };
    class TestHook extends Hook<Props, Props> {
      getInitialState() {
        return { foo: "bar" };
      }
      onChange() {
        setTimeout(() => this.setState({ foo: this.props.foo }), 10);
      }
    }

    const useTestHook = createHook(TestHook);
    const trackRender = jest.fn();
    function HookTester(props: Props) {
      const { foo } = useTestHook(props);
      trackRender(foo);
      return null;
    }

    act(() => {
      render(<HookTester foo="foo" />);
      jest.advanceTimersByTime(11);
    });
    expect(trackRender.mock.calls).toStrictEqual([["bar"], ["foo"]]);
  });

  test("hook instance only returns bait object", () => {
    type Props = { foo: string };
    type Actions = { noop: () => string };
    const noop = () => "noop";
    class TestHook extends Hook<Props, Props, Actions> {
      getInitialState() {
        return { foo: "bar" };
      }
      getActions() {
        return { noop };
      }
    }

    const useTestHook = createHook(TestHook);
    const trackRender = jest.fn();
    function HookTester(props: Props) {
      const bait = useTestHook(props);
      trackRender(bait);
      return null;
    }
    render(<HookTester foo="bar" />);
    expect(trackRender.mock.calls).toStrictEqual([[{ foo: "bar", noop }]]);
  });

  test("can use other hooks safely inside onRender()", () => {
    type Props = { foo: string };
    class TestHook extends Hook<Props, Props> {
      onRender() {
        const { foo } = this.props;
        React.useEffect(() => {
          this.setState({ foo: foo });
        }, [foo]);
      }
    }

    const useTestHook = createHook(TestHook);
    const trackRender = jest.fn();
    function HookTester(props: Props) {
      const { foo } = useTestHook(props);
      trackRender(foo);
      return null;
    }
    act(() => {
      render(<HookTester foo="bar" />);
    });
    expect(trackRender.mock.calls).toStrictEqual([[undefined], ["bar"]]);
  });
});
