// next
import Link from "next/link";

// props
export type CategoryTagProps = {
  id: string;
  size?: "sm" | "base" | "lg";
  linkBool: boolean;
  text: string;
};

const CategoryTag = ({
  id,
  size = "sm",
  linkBool = false,
  text,
}: CategoryTagProps) => {
  // サイズに応じたクラスを定義
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    base: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const baseClasses = `inline-block mb-2 border font-medium font-mono transition-colors ${sizeClasses[size]}`;

  return linkBool ? (
    <Link href={`/category/${id}`}>
      <p
        className={`${baseClasses} hover:bg-foreground hover:text-background cursor-pointer`}
      >
        {text}
      </p>
    </Link>
  ) : (
    <p className={baseClasses}>{text}</p>
  );
};

export default CategoryTag;
