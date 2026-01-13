import { render, screen } from "@testing-library/react";
import { Logo } from "./Logo";

describe("Logoコンポーネント", () => {
  it("デフォルトロゴが正しく表示される", () => {
    render(<Logo />);

    const logoImage = screen.getByAltText("Kohta Tech Blog");
    const logoText = screen.getByText("Kohta Tech Blog");

    expect(logoImage).toBeInTheDocument();
    expect(logoText).toBeInTheDocument();
  });

  it("linkBoolがtrueの時にリンクとして表示される", () => {
    render(<Logo linkHref="/test" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/test");
  });

  it("linkBoolがfalseの時にリンクなしで表示される", () => {
    render(<Logo linkBool={false} />);

    const link = screen.queryByRole("link");
    expect(link).not.toBeInTheDocument();
  });

  it("typeがiconの時にアイコンのみ表示される", () => {
    render(<Logo type="icon" />);

    const logoImage = screen.getByAltText("Kohta Tech Blog");
    const logoText = screen.queryByText("Kohta Tech Blog");

    expect(logoImage).toBeInTheDocument();
    expect(logoText).not.toBeInTheDocument();
  });

  it("typeがtextの時にテキストのみ表示される", () => {
    render(<Logo type="text" />);

    const logoText = screen.getByText("Kohta Tech Blog");
    const logoImage = screen.queryByAltText("Kohta Tech Blog");

    expect(logoText).toBeInTheDocument();
    expect(logoImage).not.toBeInTheDocument();
  });

  it("typeがminimalの時にミニマル版が表示される", () => {
    render(<Logo type="minimal" />);

    const ktbText = screen.getByText("KTB");
    const fullText = screen.queryByText("Kohta Tech Blog");

    expect(ktbText).toBeInTheDocument();
    expect(fullText).not.toBeInTheDocument();
  });

  it("正しいサイズクラスが適用される", () => {
    render(<Logo size="lg" />);
    const logoImage = screen.getByAltText("Kohta Tech Blog");

    expect(logoImage).toHaveAttribute("width", "40");
    expect(logoImage).toHaveAttribute("height", "40");
  });

  it("カスタムclassNameが適用される", () => {
    const { container } = render(<Logo className="custom-class" />);

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("カスタムidが適用される", () => {
    render(<Logo id="custom-logo" />);

    const logo = document.getElementById("custom-logo");
    expect(logo).toBeInTheDocument();
  });

  it("アクセシビリティのためのalt属性が正しく設定される", () => {
    render(<Logo />);

    const logoImage = screen.getByAltText("Kohta Tech Blog");
    expect(logoImage).toBeInTheDocument();
  });

  it("リンク使用時に適切なフォーカス管理が行われる", () => {
    render(<Logo />);

    const link = screen.getByRole("link");
    expect(link).toHaveClass("focus:outline-none");
    expect(link).toHaveClass("focus:ring-2");
  });
});
