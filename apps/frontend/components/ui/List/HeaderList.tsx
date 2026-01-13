import React from "react";

// next
import Link from "next/link";

// props
export type HeaderListProps = {
  id: string;
  href: string;
  text: string;
};

export const HeaderList = ({ id, href, text }: HeaderListProps) => {
  return (
    <Link id={id} key={id} href={href} className="block">
      <p className="text-sm font-medium hover:text-primary transition-colors duration-300">
        {text}
      </p>
    </Link>
  );
};
