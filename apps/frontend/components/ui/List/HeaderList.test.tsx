import { render, screen } from "@testing-library/react";
import { HeaderList } from "./HeaderList";

describe("HeaderListコンポーネント", () => {
  it("デフォルト表示される", () => {
    render(<HeaderList id="header-list" href="/" text="Home" />);

    const link = screen.getByRole("link");
    const text = screen.getByText("Home");

    expect(link).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });
});
