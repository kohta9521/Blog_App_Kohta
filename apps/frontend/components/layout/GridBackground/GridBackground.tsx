import React from "react";

export const GridBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* メイングリッド */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* ヘッダー下のフェードエフェクト */}
      <div className="absolute inset-x-0 top-14 h-32 bg-gradient-to-b from-background via-background/80 to-transparent" />
      
      {/* 交差点のドット */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 0px 0px, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          backgroundPosition: '0px 0px'
        }}
      />
      
      {/* サイド部分のフェード */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
};
