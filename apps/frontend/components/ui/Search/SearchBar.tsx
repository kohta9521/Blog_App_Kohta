import React from "react";

export const SearchBar = () => {
  return (
    <div className="w-full max-w-md mx-auto mb-12">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-16 py-3 bg-background/50 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="px-1.5 py-0.5 bg-muted/50 rounded text-xs">⌘</span>
            <span className="px-1.5 py-0.5 bg-muted/50 rounded text-xs">K</span>
          </div>
        </div>
      </div>
    </div>
  );
};
