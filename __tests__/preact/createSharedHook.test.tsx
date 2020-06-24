import * as React from "preact";
import { render, fireEvent } from "@testing-library/preact";
import { Hook, createSharedHook } from "../../preact";

type Props = { initialValue?: string };
type State = { value: string };
type Actions = { setValue: (v: string) => void };

class TestHook extends Hook<Props, State, Actions> {
  getInitialState(): State {
    return { value: this.props.initialValue || "hello" };
  }
  getActions() {
    return {
      setValue: (value: string) => this.setState({ value })
    };
  }
}

const [TestHookProvider, useSharedTestHook] = createSharedHook(TestHook);

function Faker({ label }: { label: string }) {
  const { value, setValue } = useSharedTestHook();
  return (
    <button type="button" onClick={() => setValue(label)}>
      {label} {value}
    </button>
  );
}

class Parent extends React.Component {
  shouldComponentUpdate(): boolean {
    return false;
  }
  render(): React.VNode {
    return <Faker label="FakerB" />;
  }
}

describe("createSharedHook", () => {
  test("works like magic", () => {
    const { getByText } = render(
      // @ts-expect-error
      <TestHookProvider initialValue="hello">
        <div>
          <Faker label="FakerA" />
        </div>
        <div>
          <Parent />
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
