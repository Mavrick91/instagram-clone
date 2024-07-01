import { act, render } from "@testing-library/react";

import { ThemeProvider, useTheme } from "./ThemeProvider";

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("provides light theme by default", () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(getByTestId("theme").textContent).toBe("light");
  });

  it("toggles theme correctly", () => {
    const { getByTestId, getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    act(() => {
      getByText("Toggle Theme").click();
    });

    expect(getByTestId("theme").textContent).toBe("dark");
  });

  it("uses theme from localStorage if available", () => {
    localStorage.setItem("theme", "dark");

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(getByTestId("theme").textContent).toBe("dark");
  });

  it("updates html class when theme changes", () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(document.documentElement.className).toBe("light");

    act(() => {
      getByText("Toggle Theme").click();
    });

    expect(document.documentElement.className).toBe("dark");
  });
});
