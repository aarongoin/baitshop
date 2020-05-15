// import * as React from "react";
// import { render } from "@testing-library/react";
import { Hook } from "../baitshop";

describe("Hook class", () => {
  test("constructor sets props, state, and bait", () => {
    class HookA extends Hook<{ foo: string }, { hello: string }, { testAction: () => string }> {
      initialState() {
        return { hello: "world" };
      }
      getActions() {



        return { testAction: () => "works!" }
      }
    }
    const props = { foo: "bar" };
    const instance = new HookA(props);

    expect(instance.props).toBe(props);

    expect(instance.state).toStrictEqual({ hello: "world" });

    expect(instance.bait.hello).toBe("world");
    expect(instance.bait.testAction).toBeInstanceOf(Function);
    expect(instance.bait.testAction()).toBe("works!");
  });
});
