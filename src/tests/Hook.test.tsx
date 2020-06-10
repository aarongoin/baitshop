// import * as React from "react";
// import { render } from "@testing-library/react";
import { Hook } from "../Hook";

type TestHookProps = {
  foo: string;
  goodbye: { text: string };
};
type TestHookState = {
  hello: string;
  qty: number;
  nested: { value: string };
};
interface TestHookActions {
  testAction: () => string;
};

class TestHook extends Hook<TestHookProps, TestHookState, TestHookActions> {
  getInitialState() {
    return {
      hello: "world",
      qty: 2000,
      nested: { value: "something something" }
    };
  }
  getActions() {
    return { testAction: () => this.state.hello };
  }
}
const testProps = { foo: "bar", goodbye: { text: "cruel world" } };

describe("Hook class", () => {
  test("constructor() - sets props, state, and bait", () => {
    const instance = new TestHook(testProps);

    expect(instance.props).toBe(testProps);

    expect(instance.state).toStrictEqual({
      hello: "world",
      qty: 2000,
      nested: { value: "something something" }
    });

    expect(instance.bait.hello).toBe("world");
    expect(instance.bait.testAction).toBeInstanceOf(Function);
    expect(instance.bait.testAction()).toBe("world");
  });

  test("default getInitialState() - is empty object", () => {
    expect(new Hook(testProps).getInitialState()).toStrictEqual({});
  });

  test("default getActions() - is empty object", () => {
    expect(new Hook(testProps).getActions()).toStrictEqual({});
  });

  test("default onMount() - is noop", () => {
    expect(new Hook(testProps).onMount()).toBeUndefined();
  });

  test("default onUnmount() - is noop", () => {
    expect(new Hook(testProps).onUnmount()).toBeUndefined();
  });

  test("default onRender() - is noop", () => {
    expect(new Hook(testProps).onRender()).toBeUndefined();
  });

  test("default onChange() - is noop", () => {
    expect(new Hook(testProps).onChange(testProps)).toBeUndefined();
  });

  test("default didPropsChange() - does shallow comparison using prop keys", () => {
    const instance = new TestHook({ ...testProps });

    expect(instance.didPropsChange(testProps)).toBe(false);

    testProps.goodbye.text = "bug free code";
    expect(instance.didPropsChange(testProps)).toBe(false);

    testProps.foo = "bizzle";
    expect(instance.didPropsChange(testProps)).toBe(true);

    testProps.foo = "bar";
    testProps.goodbye = { text: "cruel world" };
    expect(instance.didPropsChange(testProps)).toBe(true);
  });

  test("default didStateChange() - does shallow comparison using keys from update", () => {
    const instance = new TestHook(testProps);

    expect(instance.didStateChange({})).toBe(false);

    expect(instance.didStateChange({ qty: 300 })).toBe(true);

    expect(instance.didStateChange({ ...instance.state })).toBe(false);

    const testState = { ...instance.state };
    testState.nested.value = "mutated!";
    expect(instance.didStateChange(testState)).toBe(false);

    testState.nested = { value: "something something" };
    expect(instance.didStateChange(testState)).toBe(true);
  });

  describe("setState()", () => {
    test("is noop if nothing changed", () => {
      const instance = new TestHook({ ...testProps });
      instance.update = jest.fn();
      instance.didStateChange = jest.fn(() => false);
      instance.setState({ hello: "clarice" });
      expect(instance.state).toStrictEqual({
        hello: "world",
        qty: 2000,
        nested: { value: "something something" }
      });
      expect(instance.bait.hello).toBe("world");
      expect(instance.update).toHaveBeenCalledTimes(0);
    });

    test("updates state, bait, and triggers update if state changed", () => {
      const instance = new TestHook({ ...testProps });
      instance.update = jest.fn();
      instance.didStateChange = jest.fn(() => true);
      expect(instance.bait.testAction()).toBe("world");

      instance.setState({ hello: "there" });

      expect(instance.state).toStrictEqual({
        hello: "there",
        qty: 2000,
        nested: { value: "something something" }
      });
      expect(instance.bait.hello).toBe("there");
      expect(instance.bait.testAction()).toBe("there");
      expect(instance.update).toHaveBeenCalledTimes(1);
    });
  });
});
