import React from "react";

// next
import Image from "next/image";

// i18n
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

// shadcn

type HeroProps = {
  lang: Locale;
  dict: Dictionary;
};

const Hero = ({ dict }: HeroProps) => {
  return (
    <div id="blog-top-hero" className="relative min-h-screen mt-0">
      <div className="w-11/12 mx-auto max-w-7xl h-auto pt-20 pb-6 border-x relative">
        {/* title area */}
        <div className="w-[97%] mx-auto flex items-center justify-between">
          <div className="w-auto">
            <h1 className="text-5xl md:text-6xl font-light font-serif mb-2 md:mb-3">
              {dict.hero.title}
            </h1>
            <p className="text-xs md:text-base font-serif">
              {dict.hero.subtitle}
            </p>
          </div>
          {/* input area */}
          <div className="w-auto"></div>
        </div>

        {/* 交差点の四角 - 左下 */}
        <div className="absolute bottom-0 left-0 w-[6px] h-[6px] border border-white/50 bg-black -translate-x-[3.5px] translate-y-[3px]"></div>
        {/* 交差点の四角 - 右下 */}
        <div className="absolute bottom-0 right-0 w-[6px] h-[6px] border border-white/50 bg-black translate-x-[3.5px] translate-y-[3px]"></div>
      </div>

      <div className="w-[97%] mx-auto relative">
        <span className="block w-full h-px border-t"></span>
      </div>

      {/* blog list area */}
      <div className="w-11/12 mx-auto max-w-7xl h-auto border-x relative">
        <div className="w-full h-[600px] blok md:flex">
          <div className="group cursor-pointer w-full md:w-1/2 h-full border-r border-dashed p-6 hover:bg-card/50 transition-all duration-300 flex flex-col">
            <div className="w-full h-full max-h-[300px] border rounded-md overflow-hidden mb-4">
              <Image
                src="/sample-blog-bg.png"
                alt="blog-1"
                width={600}
                height={500}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-full flex-1 flex flex-col justify-between">
              <div className="w-full h-auto">
                <p className="inline-block mb-2 px-2 py-1 border text-xs font-medium font-mono">
                  Frontend
                </p>
                <h2 className="text-3xl font-medium font-mono tracking-tight leading-tight">
                  5 Key Considerations for Next.js ver16. ver15
                </h2>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="w-auto flex items-center gap-2">
                  <div className="w-[35px] h-[35px] border rounded-md overflow-hidden">
                    <Image
                      src="/sample-blog-bg.png"
                      alt="blog-1"
                      width={35}
                      height={35}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-sm font-medium font-mono text-muted-foreground">
                    Kohta Kochi
                  </p>
                </div>
                <div className="w-auto">
                  <p className="text-sm text-muted-foreground">
                    NOVEMBER 20, 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            {/* card */}
            <div className="group cursor-pointer w-full h-[200px] p-6 border-b border-dashed flex items-center justify-between hover:bg-card/50 transition-all duration-300">
              <div className="w-1/2 h-full">
                <div className="w-full h-full border rounded-md overflow-hidden mb-4">
                  <Image
                    src="/sample-blog-bg.png"
                    alt="blog-1"
                    width={600}
                    height={500}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="w-1/2 h-full px-5">
                <div className="w-full h-auto flex items-center gap-2">
                  <p className="inline-block mb-2 px-2 py-1 border text-xs font-medium font-mono">
                    Rust
                  </p>
                  <p className="inline-block mb-2 px-2 py-1 border text-xs font-medium font-mono">
                    Backend
                  </p>
                </div>
                <h2 className="text-2xl font-medium font-mono tracking-tight leading-tight line-clamp-2">
                  Rust Official Doc Explained in Super Simple Terms
                </h2>
              </div>
            </div>
            {/* card */}
            <div className="group cursor-pointer w-full h-[200px] p-6 border-b border-dashed flex items-center justify-between hover:bg-card/50 transition-all duration-300">
              <div className="w-1/2 h-full">
                <div className="w-full h-full border rounded-md overflow-hidden mb-4">
                  <Image
                    src="/sample-blog-bg.png"
                    alt="blog-1"
                    width={600}
                    height={500}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="w-1/2 h-full px-5">
                <div className="w-full h-auto flex items-center gap-2">
                  <p className="inline-block mb-2 px-2 py-1 border text-xs font-medium font-mono">
                    Next.js
                  </p>
                  <p className="inline-block mb-2 px-2 py-1 border text-xs font-medium font-mono">
                    Frontend
                  </p>
                </div>
                <h2 className="text-2xl font-medium font-mono tracking-tight leading-tight line-clamp-2">
                  Multilingual Support in the Next.js App Router
                </h2>
              </div>
            </div>
            {/* card */}
            <div className="group cursor-pointer w-full h-[200px] p-6 flex items-center justify-between hover:bg-card/50 transition-all duration-300">
              <div className="w-1/2 h-full">
                <div className="w-full h-full border rounded-md overflow-hidden mb-4">
                  <Image
                    src="/sample-blog-bg.png"
                    alt="blog-1"
                    width={600}
                    height={500}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="w-1/2 h-full px-5">
                <div className="w-full h-auto flex items-center gap-2">
                  <p className="inline-block mb-2 px-2 py-1 border text-xs font-medium font-mono">
                    Rust
                  </p>
                  <p className="inline-block mb-2 px-2 py-1 border text-xs font-medium font-mono">
                    Backend
                  </p>
                  <p className="inline-block mb-2 px-2 py-1 border text-xs font-medium font-mono">
                    Axum
                  </p>
                </div>
                <h2 className="text-2xl font-medium font-mono tracking-tight leading-tight line-clamp-2">
                  Lightning-Fast API Development with Auxm
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* 交差点の四角 - 左下 */}
        <div className="absolute bottom-0 left-0 w-[6px] h-[6px] border border-white/50 bg-black -translate-x-[3.5px] translate-y-[3px]"></div>
        {/* 交差点の四角 - 右下 */}
        <div className="absolute bottom-0 right-0 w-[6px] h-[6px] border border-white/50 bg-black translate-x-[3.5px] translate-y-[3px]"></div>
      </div>

      <div className="w-[97%] mx-auto relative">
        <span className="block w-full h-px border-t"></span>
      </div>
    </div>
  );
};

export default Hero;
