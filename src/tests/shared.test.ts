import { noop } from "../shared";

test("noop", () => {
  expect(noop()).toBeNull();
});