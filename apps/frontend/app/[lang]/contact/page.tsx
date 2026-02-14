import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ContactForm } from "@/components/forms/ContactForm";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const contact = dict.contact;

  if (!contact) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w-full px-4 max-w-screen-3xl mx-auto py-4 sm:py-6 lg:w-11/12 lg:px-0 lg:py-6">
        {/* Title */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-doto font-normal tracking-tight mb-4">
            {contact.title}
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground font-mono mb-2">
            {contact.subtitle}
          </p>
          <span className="block w-full h-1 border-b"></span>
        </div>

        {/* Main Contents */}
        <div id="main-contents" className="w-full h-auto py-6 space-y-12">
          {/* Intro Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {contact.intro.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {contact.intro.description}
            </p>
          </section>

          {/* Contact Form */}
          <section>
            <ContactForm lang={lang} contact={contact} />
          </section>

          {/* Info Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {contact.info.title}
            </h2>
            <ul className="space-y-2">
              {contact.info.items.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-start"
                >
                  <span className="mr-2">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Response Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {contact.response.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {contact.response.description}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

