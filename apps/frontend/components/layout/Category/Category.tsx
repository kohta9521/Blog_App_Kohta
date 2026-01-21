import React from "react";

// next
import Image from "next/image";

// components
import CategoryTag from "@/components/ui/Tag/CategoryTag";

const Category = () => {
  return (
    <div id="blog-top-category" className="relative h-auto">
      {/* title box */}
      <div className="w-11/12 mx-auto max-w-[1500px] h-auto border-x relative">
        <div className="w-[97%] mx-auto h-auto py-10 flex items-center justify-between">
          <div className="w-auto">
            <h1 className="text-3xl font-extralight font-serif">
              Browse by category:
            </h1>
          </div>
          <div className="w-auto flex items-center gap-3">
            <CategoryTag id="all" size="base" linkBool={true} text="All" />
            <CategoryTag
              id="frontend"
              size="base"
              linkBool={true}
              text="Frontend"
            />
            <CategoryTag
              id="backend"
              size="base"
              linkBool={true}
              text="Backend"
            />
            <CategoryTag id="uiux" size="base" linkBool={true} text="UI/UX" />
            <CategoryTag
              id="security"
              size="base"
              linkBool={true}
              text="Secutiry"
            />
            <CategoryTag id="pm" size="base" linkBool={true} text="PM" />
            <CategoryTag id="study" size="base" linkBool={true} text="Study" />
            <CategoryTag
              id="others"
              size="base"
              linkBool={true}
              text="Others"
            />
          </div>
        </div>

        {/* 交差点の四角 - 左下 */}
        <div className="absolute bottom-0 left-0 w-[6px] h-[6px] border border-white/50 bg-black -translate-x-[3.5px] translate-y-[3px]"></div>
        {/* 交差点の四角 - 右下 */}
        <div className="absolute bottom-0 right-0 w-[6px] h-[6px] border border-white/50 bg-black translate-x-[3.5px] translate-y-[3px]"></div>
      </div>

      {/* border */}
      <div className="w-[97%] mx-auto relative">
        <span className="block w-full h-px border-t"></span>
      </div>

      {/* main contents */}
      <div className="w-11/12 mx-auto max-w-[1500px] h-auto border-x relative">
        {/* 一列目 */}
        <div className="w-full h-[470px] flex border-b border-dashed">
          <div className="w-full md:w-1/3 h-full p-6 border-r border-dashed">
            <div className="w-full h-full max-h-[230px] border rounded-md overflow-hidden mb-4">
              <Image
                src="/sample-blog-bg.png"
                alt="blog-1"
                width={600}
                height={500}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-full flex-1 flex-col justify-between">
              <div className="w-full h-auto">
                <h2 className="text-2xl font-medium font-mono tracking-tight leading-tight">
                  Lightning-Fast API Development with Auxm
                </h2>
              </div>
              <div className="w-full h-auto">
                <p className="text-sm text-muted-foreground">
                  NOVEMBER 20, 2025
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 h-full border-r border-dashed"></div>
          <div className="w-full md:w-1/3 h-full"></div>
        </div>
        {/* 二列目 */}
        <div className="w-full h-[500px] relative flex border-b border-dashed">
          <div className="w-full md:w-1/3 h-full border-r border-dashed"></div>
          <div className="w-full md:w-1/3 h-full border-r border-dashed"></div>
          <div className="w-full md:w-1/3 h-full"></div>
          {/* 交差点の四角 - 左下 */}
          <div className="absolute bottom-0 left-0 w-[6px] h-[6px] border border-white/50 bg-black -translate-x-[3.5px] translate-y-[3px]"></div>
          {/* 交差点の四角 - 右下 */}
          <div className="absolute bottom-0 right-0 w-[6px] h-[6px] border border-white/50 bg-black translate-x-[3.5px] translate-y-[3px]"></div>
        </div>
        {/* pagenation */}
        <div className="w-full h-auto py-14 relative">
          {/* 交差点の四角 - 左下 */}
          <div className="absolute bottom-0 left-0 w-[6px] h-[6px] border border-white/50 bg-black -translate-x-[3.5px] translate-y-[3px]"></div>
          {/* 交差点の四角 - 右下 */}
          <div className="absolute bottom-0 right-0 w-[6px] h-[6px] border border-white/50 bg-black translate-x-[3.5px] translate-y-[3px]"></div>
        </div>
      </div>

      {/* border */}
      <div className="w-full mx-auto relative">
        <span className="block w-full h-px border-t"></span>
      </div>
    </div>
  );
};

export default Category;
