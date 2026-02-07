"use client";
// next
import { usePathname } from "next/navigation";
import { useState } from "react";

// components
import { HeaderList } from "@/components/ui/List/HeaderList";
import { Logo } from "@/components/ui/Logo/Logo";
import { LanguageSwitcher } from "@/components/ui/Switcher/LanguageSwitcher";
import { ConsoleModal } from "@/components/ui/Console/ConsoleModal";

// i18n
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

// props
export type HeaderProps = {
  id: string;
  lang: Locale;
  dict: Dictionary;
};

const Header = ({ id, lang, dict }: HeaderProps) => {
  const pathname = usePathname();
  const [consoleOpen, setConsoleOpen] = useState(false);
  const consoleText = dict.common.console ?? "CONSOLE";
  const consoleFirstLetter = consoleText[0]?.toUpperCase() ?? "C";

  return (
    <header
      id={id}
      key={id}
      className="w-full h-16 bg-background/95 backdrop-blur-md  sticky top-0.5 z-40"
    >
      <div className="w-11/12 h-full mx-auto flex items-center justify-between">
        <div className="w-auto flex items-center gap-4">
          <Logo
            id="logo"
            type="icon"
            linkBool={true}
            linkHref={`/${lang}`}
            size="sm"
            className=""
          />
          <div className="hidden md:flex w-auto items-center gap-2">
            <HeaderList
              id="header-list-home"
              href={`/${lang}`}
              text={dict.common.home}
              isActive={pathname === `/${lang}` || pathname === "/"}
            />
            <HeaderList
              id="header-list-book"
              href={`/${lang}/book`}
              text="BOOKS"
              isActive={pathname.startsWith(`/${lang}/book`)}
            />
            <HeaderList
              id="header-list-about"
              href={`/${lang}/about`}
              text={dict.common.about}
              isActive={pathname === `/${lang}/about` || pathname === "/"}
            />
            <HeaderList
              id="header-list-profile"
              href={`/${lang}/profile`}
              text={dict.common.profile}
              isActive={pathname === `/${lang}/profile` || pathname === "/"}
            />
            <HeaderList
              id="header-list-contact"
              href={`/${lang}/contact`}
              text={dict.common.contact}
              isActive={pathname === `/${lang}/contact` || pathname === "/"}
            />
          </div>
        </div>

        {/* Right Lists */}
        <div className="w-auto hidden md:flex lg:flex xl:flex items-center gap-4">
          <button
            id="header-list-console"
            key="console"
            onClick={() => setConsoleOpen(true)}
            className="block group border border-border px-2 py-0.5 transition-all duration-300 bg-transparent hover:bg-secondary/50 cursor-pointer"
          >
            <p className="text-sm font-doto text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
              <span className="mr-1 text-sm">[{consoleFirstLetter}]</span>
              {consoleText}
            </p>
          </button>
          <ConsoleModal
            open={consoleOpen}
            onOpenChange={setConsoleOpen}
            message={dict.common.consoleUnderDevelopment ?? undefined}
          />
          <LanguageSwitcher currentLocale={lang} />
        </div>
        <div className="w-auto block md:hidden lg:hidden xl:hidden">三</div>
      </div>
    </header>
  );
};

export default Header;
