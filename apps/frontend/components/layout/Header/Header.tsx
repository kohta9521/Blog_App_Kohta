// components
import { HeaderList } from "@/components/ui/List/HeaderList";
import { Logo } from "@/components/ui/Logo/Logo";
import { LanguageSwitcher } from "@/components/ui/Switcher/LanguageSwitcher";

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
  return (
    <header
      id={id}
      key={id}
      className="w-full h-16 bg-background/95 backdrop-blur-md border-b  sticky top-0.5 z-40"
    >
      <div className="w-[95%] h-full mx-auto flex items-center justify-between">
        <Logo
          id="logo"
          type="default"
          linkBool={true}
          linkHref={`/${lang}`}
          size="sm"
          className=""
        />
        {/* Center Lists */}
        <div className="w-auto hidden md:flex lg:flex xl:flex items-center gap-7">
          <HeaderList
            id="header-list-home"
            href={`/${lang}`}
            text={dict.common.home}
          />
          <HeaderList
            id="header-list-about"
            href={`/${lang}/about`}
            text={dict.common.about}
          />
          <HeaderList
            id="header-list-blog"
            href={`/${lang}/blog`}
            text={dict.common.blog}
          />
          <HeaderList
            id="header-list-contact"
            href={`/${lang}/contact`}
            text={dict.common.contact}
          />
        </div>
        {/* Right Lists */}
        <div className="w-auto hidden md:flex lg:flex xl:flex items-center gap-4">
          <LanguageSwitcher currentLocale={lang} />
        </div>
        <div className="w-auto block md:hidden lg:hidden xl:hidden">三</div>
      </div>
    </header>
  );
};

export default Header;
