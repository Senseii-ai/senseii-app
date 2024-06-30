import { Hello } from "../../services/test/test.service";

describe("This is a test for testing setup", () => {
  it("running Hello function should return a greeting with the name passed as argyment", () => {
    expect(Hello("Prateek")).toBe("Hello Prateek");
  });
});
