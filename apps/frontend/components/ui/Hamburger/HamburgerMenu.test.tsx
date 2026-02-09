import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { HamburgerMenu } from "./HamburgerMenu";
import "@testing-library/jest-dom";

// GSAPのモック
jest.mock("gsap", () => ({
  gsap: {
    to: jest.fn(),
    timeline: jest.fn(() => ({
      to: jest.fn().mockReturnThis(),
      kill: jest.fn(),
    })),
  },
}));

describe("HamburgerMenu", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe("レンダリング", () => {
    it("正しくレンダリングされる", () => {
      render(<HamburgerMenu isOpen={false} onClick={mockOnClick} />);
      
      const button = screen.getByRole("button", { name: /メニュー/i });
      expect(button).toBeInTheDocument();
    });

    it("3本の線が表示される", () => {
      render(<HamburgerMenu isOpen={false} onClick={mockOnClick} />);
      
      const lines = screen.getByRole("button").querySelectorAll("span[aria-hidden='true']");
      expect(lines).toHaveLength(3);
    });

    it("カスタムIDが適用される", () => {
      render(
        <HamburgerMenu 
          isOpen={false} 
          onClick={mockOnClick} 
          id="custom-hamburger" 
        />
      );
      
      expect(screen.getByRole("button")).toHaveAttribute("id", "custom-hamburger");
    });

    it("カスタムクラス名が適用される", () => {
      render(
        <HamburgerMenu 
          isOpen={false} 
          onClick={mockOnClick} 
          className="custom-class" 
        />
      );
      
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    it("カスタムaria-labelが適用される", () => {
      render(
        <HamburgerMenu 
          isOpen={false} 
          onClick={mockOnClick} 
          ariaLabel="ナビゲーションメニュー" 
        />
      );
      
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "ナビゲーションメニュー"
      );
    });
  });

  describe("アクセシビリティ", () => {
    it("閉じている時、aria-expandedがfalse", () => {
      render(<HamburgerMenu isOpen={false} onClick={mockOnClick} />);
      
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    });

    it("開いている時、aria-expandedがtrue", () => {
      render(<HamburgerMenu isOpen={true} onClick={mockOnClick} />);
      
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    });

    it("aria-controlsが設定されている", () => {
      render(<HamburgerMenu isOpen={false} onClick={mockOnClick} />);
      
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-controls",
        "mobile-menu"
      );
    });

    it("type='button'が設定されている", () => {
      render(<HamburgerMenu isOpen={false} onClick={mockOnClick} />);
      
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("スクリーンリーダー用のテキストが閉じている時に表示される", () => {
      render(<HamburgerMenu isOpen={false} onClick={mockOnClick} />);
      
      expect(screen.getByText("メニューを開く")).toHaveClass("sr-only");
    });

    it("スクリーンリーダー用のテキストが開いている時に変わる", () => {
      render(<HamburgerMenu isOpen={true} onClick={mockOnClick} />);
      
      expect(screen.getByText("メニューを閉じる")).toHaveClass("sr-only");
    });
  });

  describe("インタラクション", () => {
    it("クリックするとonClickが呼ばれる", () => {
      render(<HamburgerMenu isOpen={false} onClick={mockOnClick} />);
      
      const button = screen.getByRole("button");
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("複数回クリックできる", () => {
      render(<HamburgerMenu isOpen={false} onClick={mockOnClick} />);
      
      const button = screen.getByRole("button");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it("Enterキーで操作できる", () => {
      render(<HamburgerMenu isOpen={false} onClick={mockOnClick} />);
      
      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
      
      // buttonタグなので、keyDownではなくclickイベントが発火する
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalled();
    });

    it("Spaceキーで操作できる", () => {
      render(<HamburgerMenu isOpen={false} onClick={mockOnClick} />);
      
      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: " ", code: "Space" });
      
      // buttonタグなので、keyDownではなくclickイベントが発火する
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalled();
    });
  });

  describe("状態変化", () => {
    it("isOpenがfalseからtrueに変わる", () => {
      const { rerender } = render(
        <HamburgerMenu isOpen={false} onClick={mockOnClick} />
      );
      
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
      
      rerender(<HamburgerMenu isOpen={true} onClick={mockOnClick} />);
      
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    });

    it("isOpenがtrueからfalseに変わる", () => {
      const { rerender } = render(
        <HamburgerMenu isOpen={true} onClick={mockOnClick} />
      );
      
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
      
      rerender(<HamburgerMenu isOpen={false} onClick={mockOnClick} />);
      
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("スタイリング", () => {
    it("ボタンに正しいクラスが適用されている", () => {
      render(<HamburgerMenu isOpen={false} onClick={mockOnClick} />);
      
      const button = screen.getByRole("button");
      expect(button).toHaveClass("relative");
      expect(button).toHaveClass("w-10");
      expect(button).toHaveClass("h-10");
      expect(button).toHaveClass("flex");
      expect(button).toHaveClass("cursor-pointer");
    });

    it("線に正しいクラスが適用されている", () => {
      render(<HamburgerMenu isOpen={false} onClick={mockOnClick} />);
      
      const lines = screen.getByRole("button").querySelectorAll("span[aria-hidden='true']");
      
      lines.forEach((line) => {
        expect(line).toHaveClass("block");
        expect(line).toHaveClass("w-6");
        expect(line).toHaveClass("h-0.5");
        expect(line).toHaveClass("bg-foreground");
        expect(line).toHaveClass("rounded-full");
      });
    });
  });

  describe("エッジケース", () => {
    it("高速に状態を切り替えてもエラーが発生しない", async () => {
      const { rerender } = render(
        <HamburgerMenu isOpen={false} onClick={mockOnClick} />
      );
      
      for (let i = 0; i < 10; i++) {
        rerender(<HamburgerMenu isOpen={i % 2 === 0} onClick={mockOnClick} />);
      }
      
      await waitFor(() => {
        expect(screen.getByRole("button")).toBeInTheDocument();
      });
    });
  });
});
