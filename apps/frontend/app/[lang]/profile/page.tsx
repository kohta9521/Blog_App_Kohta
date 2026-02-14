import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PersonStructuredData } from "@/components/seo/StructuredData";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kohta-tech-blog.com";
  
  const title = lang === "ja" 
    ? "河内光太のプロフィール | COO・PdM・フロントエンドエンジニア"
    : "Kohta Kochi's Profile | COO, PdM, Frontend Engineer";
  
  const description = lang === "ja"
    ? "QueryLift COO、メルカリPdM、学習院大学法学部4年生。Rust・Next.js・TypeScriptを使ったフルスタック開発、技術コミュニティ運営、イベント企画を行うエンジニア。個人開発で5000+ユーザー獲得。"
    : "COO at QueryLift, PdM at Mercari, 4th year law student at Gakushuin University. Full-stack engineer specializing in Rust, Next.js, and TypeScript. Community organizer with 5000+ users across personal projects.";

  const keywords = lang === "ja"
    ? "河内光太, Kohta Kochi, QueryLift, メルカリ, 学習院大学, COO, PdM, フロントエンドエンジニア, Rust, Next.js, TypeScript, フルスタック開発, GDG Tokyo, Enter, UFES"
    : "Kohta Kochi, QueryLift, Mercari, Gakushuin University, COO, PdM, Frontend Engineer, Rust, Next.js, TypeScript, Full-Stack Development, GDG Tokyo, Enter, UFES";

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Kohta Kochi", url: `${siteUrl}/${lang}/profile` }],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${lang}/profile`,
      type: "profile",
      locale: lang === "ja" ? "ja_JP" : "en_US",
      images: [{
        url: `${siteUrl}/logo_icon.png`,
        width: 1200,
        height: 630,
        alt: "Kohta Kochi Profile",
      }],
      firstName: "Kohta",
      lastName: "Kochi",
      username: "kohtakochi",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/logo_icon.png`],
      creator: "@kohtakochi",
    },
    alternates: {
      canonical: `${siteUrl}/${lang}/profile`,
      languages: {
        'ja': `${siteUrl}/ja/profile`,
        'en': `${siteUrl}/en/profile`,
      },
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const profile = dict.profile;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kohta-tech-blog.com";

  if (!profile) {
    return null;
  }

  return (
    <>
      {/* Person構造化データ */}
      <PersonStructuredData
        data={{
          name: "Kohta Kochi (河内光太)",
          url: `${siteUrl}/${lang}/profile`,
          image: `${siteUrl}/logo_icon.png`,
          jobTitle: "COO, Product Manager, Frontend Engineer",
          description: lang === "ja"
            ? "QueryLift COO、メルカリPdM、学習院大学法学部4年生。Rust・Next.js・TypeScriptを使ったフルスタック開発、技術コミュニティ運営を行うエンジニア。"
            : "COO at QueryLift, PdM at Mercari, 4th year law student at Gakushuin University. Full-stack engineer specializing in Rust, Next.js, and TypeScript.",
          sameAs: [
            "https://github.com/kohtakochi",
            "https://www.linkedin.com/in/%E5%85%89%E5%A4%AA-%E6%B2%B3%E5%86%85-89476b2a2/",
            "https://youtrust.jp/users/eb8e4617b498acc0cf929be4d1f039ba",
            "https://www.wantedly.com/id/kouta_kochi_f",
          ],
          worksFor: [
            { name: "QueryLift", url: "https://querylift.com" },
            { name: "Mercari, Inc.", url: "https://about.mercari.com/" },
            { name: "MediaAid Inc." },
            { name: "Google Developers Group Tokyo" },
          ],
          alumniOf: [
            { name: "Gakushuin University", url: "https://www.univ.gakushuin.ac.jp/" },
            { name: "University of People" },
          ],
          knowsAbout: [
            "Rust",
            "Next.js",
            "TypeScript",
            "React",
            "Vue.js",
            "Node.js",
            "Python",
            "Go",
            "AWS",
            "Docker",
            "Terraform",
            "Full-Stack Development",
            "Frontend Development",
            "Backend Development",
            "Web Development",
            "Event Planning",
            "Community Management",
          ],
        }}
      />
      <div className="max-w-4xl mx-auto">
      <div className="w-full px-4 max-w-screen-3xl mx-auto py-4 sm:py-6 lg:w-11/12 lg:px-0 lg:py-6">
        {/* Title */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-doto font-normal tracking-tight mb-4">
            {profile.title}
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground font-mono mb-2">
            {profile.subtitle}
          </p>
          <span className="block w-full h-1 border-b"></span>
        </div>

        {/* Main Contents */}
        <div id="main-contents" className="w-full h-auto py-6 space-y-12">
          {/* Profile Header */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 border rounded-sm overflow-hidden bg-muted relative">
                  {/* プレースホルダー - 実際の画像を /public/images/profile.jpg または profile.png に配置すると表示されます */}
                  <div className="w-full h-full flex items-center justify-center text-5xl font-mono text-muted-foreground">
                    K
                  </div>
                  {/* 実際の画像を使用する場合は、以下のコメントを解除してください
                  <Image
                    src="/images/profile.jpg"
                    alt={profile.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  */}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-mono font-medium tracking-tight">
                    {profile.name}
                  </h2>
                  <p className="text-sm text-muted-foreground font-mono">
                    {profile.nameEn}
                  </p>
                </div>
                <div className="inline-block px-3 py-1 border rounded-sm text-xs font-mono">
                  {profile.currentRole}
                </div>
              </div>
            </div>
          </section>

          {/* Bio Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {profile.bio.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {profile.bio.content}
            </p>
          </section>

          {/* Experience Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {profile.experience.title}
            </h2>
            <div className="space-y-4">
              {profile.experience.items.map((exp, index) => (
                <div key={index} className="border-l-2 pl-4 space-y-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-sm font-mono font-medium">
                      {exp.company}
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono">
                      · {exp.period}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">
                    {exp.role}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground pt-1">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {profile.education.title}
            </h2>
            <div className="space-y-4">
              {profile.education.items.map((edu, index) => (
                <div key={index} className="border-l-2 pl-4 space-y-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-sm font-mono font-medium">
                      {edu.institution}
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono">
                      · {edu.period}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">
                    {edu.degree}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground pt-1">
                    {edu.focus}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {profile.skills.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Frontend */}
              <div className="border rounded-sm p-4 space-y-2">
                <h3 className="text-sm font-mono font-medium">
                  {profile.skills.frontend.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {profile.skills.frontend.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs font-mono border rounded-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div className="border rounded-sm p-4 space-y-2">
                <h3 className="text-sm font-mono font-medium">
                  {profile.skills.backend.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {profile.skills.backend.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs font-mono border rounded-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Infrastructure */}
              <div className="border rounded-sm p-4 space-y-2">
                <h3 className="text-sm font-mono font-medium">
                  {profile.skills.infrastructure.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {profile.skills.infrastructure.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs font-mono border rounded-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Other */}
              <div className="border rounded-sm p-4 space-y-2">
                <h3 className="text-sm font-mono font-medium">
                  {profile.skills.other.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {profile.skills.other.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs font-mono border rounded-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Achievements Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {profile.achievements.title}
            </h2>
            <ul className="space-y-2">
              {profile.achievements.items.map((achievement, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-start"
                >
                  <span className="mr-2">·</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Projects & Portfolio Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {profile.projects.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {profile.projects.items.map((project, index) => (
                <div
                  key={index}
                  className="border rounded-sm p-4 space-y-3 hover:border-foreground transition-colors duration-200"
                >
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-sm font-mono font-medium">
                        {project.name}
                      </h3>
                      <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                        {project.date}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-mono bg-muted rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Community Activities Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {profile.community.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {profile.community.description}
            </p>
            <ul className="space-y-2 pt-2">
              {profile.community.items.map((item, index) => (
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

          {/* Interests Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {profile.interests.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.interests.items.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 text-xs font-mono border rounded-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>

          {/* Vision Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {profile.vision.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {profile.vision.content}
            </p>
          </section>

          {/* Links Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-mono font-normal tracking-tight border-b pb-2">
              {profile.links.title}
            </h2>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/kohtakochi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-mono border-b border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors duration-200"
              >
                {profile.links.github}
                <span className="ml-1">↗</span>
              </a>
              <a
                href="https://www.linkedin.com/in/%E5%85%89%E5%A4%AA-%E6%B2%B3%E5%86%85-89476b2a2/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-mono border-b border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors duration-200"
              >
                {profile.links.linkedin}
                <span className="ml-1">↗</span>
              </a>
              <a
                href="https://youtrust.jp/users/eb8e4617b498acc0cf929be4d1f039ba"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-mono border-b border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors duration-200"
              >
                YOUTRUST
                <span className="ml-1">↗</span>
              </a>
              <a
                href="https://www.wantedly.com/id/kouta_kochi_f"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-mono border-b border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors duration-200"
              >
                {profile.links.wantedly}
                <span className="ml-1">↗</span>
              </a>
            </div>
          </section>

          {/* Back to About CTA */}
          <section className="pt-8 pb-4">
            <div className="border-t pt-8 flex justify-center">
              <Link
                href={`/${lang}/about`}
                className="inline-flex items-center text-xs font-mono border-b border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors duration-200"
              >
                ← {lang === "ja" ? "Aboutページに戻る" : "Back to About"}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
