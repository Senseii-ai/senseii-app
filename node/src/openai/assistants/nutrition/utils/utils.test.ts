import { Hello } from "./utils";

describe("Test the nutrition assistant utils functions", () => {
  test("Hello funciton should take an input string and return 'world'", () => {
    expect(Hello("prateek")).toBe("Hello prateek")
  })
})
