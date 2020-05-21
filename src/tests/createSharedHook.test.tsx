import * as React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Hook } from "../Hook";
import { createSharedHook } from "../createSharedHook";

type Props = { initialValue?: string };
type State = { value: string };
type Actions = { setValue: (v: string) => void };

class TestHook extends Hook<Props, State, Actions> {
  initialState(): State {
    return { value: this.props.initialValue || "hello" };
  }
  getActions() {
    return {
      setValue: (value: string) => this.setState({ value })
    };
  }
}

describe("createSharedHook", () => {
  test("works like magic", () => {
    const [TestHookProvider, useSharedTestHook] = createSharedHook(TestHook);

    function Faker({ label }: { label: string }) {
      const { value, setValue } = useSharedTestHook();
      return (
        <button type="button" onClick={() => setValue(label)}>
          {label} {value}
        </button>
      );
    }

    const { getByText } = render(
      <TestHookProvider initialValue="hello">
        <div>
          <Faker label="FakerA" />
        </div>
        <div>
          <span>
            <Faker label="FakerB" />
          </span>
        </div>
      </TestHookProvider>
    );
    getByText("FakerA hello");
    getByText("FakerB hello");

    fireEvent.click(getByText("FakerA hello"));

    getByText("FakerA FakerA");
    getByText("FakerB FakerA");

    fireEvent.click(getByText("FakerB FakerA"));

    getByText("FakerA FakerB");
    getByText("FakerB FakerB");
  });
});
