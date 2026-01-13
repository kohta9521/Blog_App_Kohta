import React from "react";
import Image from "next/image";

interface BlogCardProps {
  title: string;
  description?: string;
  category: string;
  author: string;
  date: string;
  image?: string;
  size?: "large" | "medium" | "small";
}

export const BlogCard = ({
  title,
  description,
  category,
  author,
  date,
  image,
  size = "medium",
}: BlogCardProps) => {
  const sizeClasses = {
    large: "col-span-2 row-span-2",
    medium: "col-span-1 row-span-1",
    small: "col-span-1 row-span-1",
  };

  return (
    <article
      className={`group cursor-pointer border border-border/20 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 ${sizeClasses[size]}`}
    >
      {/* カテゴリタグ */}
      <div className="p-4 pb-0">
        <span className="inline-block px-2 py-1 text-xs font-mono uppercase tracking-wider bg-muted/50 text-muted-foreground rounded">
          {category}
        </span>
      </div>

      {/* 画像部分 */}
      {image && (
        <div className="relative h-48 mx-4 mt-4 overflow-hidden rounded bg-muted/20">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* コンテンツ部分 */}
      <div className="p-4">
        <h3
          className={`font-serif font-medium leading-tight mb-2 group-hover:text-blue-400 transition-colors ${
            size === "large" ? "text-xl" : "text-lg"
          }`}
        >
          {title}
        </h3>

        {description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* 著者と日付 */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {author.charAt(0)}
            </div>
            <span>{author}</span>
          </div>
          <span>{date}</span>
        </div>
      </div>
    </article>
  );
};
