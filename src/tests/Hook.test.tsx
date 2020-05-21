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
type TestHookActions = {
  testAction: () => string;
};

class TestHook extends Hook<TestHookProps, TestHookState, TestHookActions> {
  initialState() {
    return {
      hello: "world",
      qty: 2000,
      nested: { value: "something something" }
    };
  }
  getActions() {
    return { testAction: () => "works!" };
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
    expect(instance.bait.testAction()).toBe("works!");
  });

  test("default initialState() - is empty object", () => {
    expect(new Hook(testProps).initialState()).toStrictEqual({});
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
    expect(
      new Hook(testProps).onChange(testProps)
    ).toBeUndefined();
  });

  test("default watchProps() - uses all prop keys", () => {
    const instance = new TestHook(testProps);

    expect(instance.watchProps()).toStrictEqual(["foo", "goodbye"]);
  });

  test("default havePropsChanged() - does shallow comparison", () => {
    const instance = new TestHook({ ...testProps });

    expect(
      instance.havePropsChanged(testProps, ["foo", "goodbye"])
    ).toBe(false);

    testProps.goodbye.text = "bug free code";
    expect(
      instance.havePropsChanged(testProps, ["foo", "goodbye"])
    ).toBe(false);

    testProps.foo = "bizzle";
    expect(
      instance.havePropsChanged(testProps, ["foo", "goodbye"])
    ).toBe(true);

    expect(instance.havePropsChanged(testProps, [])).toBe(
      false
    );

    testProps.foo = "bar";
    testProps.goodbye = { text: "cruel world" };
    expect(
      instance.havePropsChanged(testProps, ["foo", "goodbye"])
    ).toBe(true);
  });

  test("default hasStateChanged() - does shallow comparison using keys from update", () => {
    const instance = new TestHook(testProps);

    expect(instance.hasStateChanged({})).toBe(false);

    expect(instance.hasStateChanged({ qty: 300 })).toBe(true);

    expect(
      instance.hasStateChanged({ ...instance.state })
    ).toBe(false);

    const testState = { ...instance.state };
    testState.nested.value = "mutated!";
    expect(instance.hasStateChanged(testState)).toBe(false);

    testState.nested = { value: "something something" };
    expect(instance.hasStateChanged(testState)).toBe(true);
  });

  describe("setState()", () => {
    test("is noop if nothing changed", () => {
      const instance = new TestHook({ ...testProps });
      instance.update = jest.fn();
      instance.hasStateChanged = jest.fn(() => false);
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
      instance.hasStateChanged = jest.fn(() => true);

      const { testAction } = instance.bait;

      instance.setState({ hello: "there" });

      expect(instance.state).toStrictEqual({
        hello: "there",
        qty: 2000,
        nested: { value: "something something" }
      });
      expect(instance.bait.hello).toBe("there");
      // actions should be identical
      expect(instance.bait.testAction).toBe(testAction);
      expect(instance.update).toHaveBeenCalledTimes(1);
    });
  });
});
