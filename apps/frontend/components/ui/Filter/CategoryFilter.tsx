import React from "react";

const categories = [
  "ALL",
  "AI & MCP",
  "SDKS",
  "TERRAFORM",
  "ENGINEERING",
  "REQUEST & RESPONSE",
  "OTHER",
];

export const CategoryFilter = () => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-serif mb-4">Browse by category:</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider border border-border/30 bg-background/50 hover:bg-muted/50 transition-colors rounded"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
