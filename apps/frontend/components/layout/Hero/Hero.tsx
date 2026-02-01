import React from "react";

// i18n
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

// shadcn

type HeroProps = {
  lang: Locale;
  dict: Dictionary;
};

const Hero = ({ dict }: HeroProps) => {
  const number = 10;
  return (
    <div id="blog-top-hero" className="w-10/12 h-full mx-auto">
      <div className="flex items-top gap-1 ">
        <h1 className="font-mono text-7xl">Blog</h1>
        <p className="block ">({number})</p>
      </div>
    </div>
  );
};

export default Hero;
