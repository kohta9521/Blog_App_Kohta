"use client";

import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { HeroSection } from "../components/custom/hero-section";
import { ContentCard } from "../components/custom/content-card";

export default function Home() {
  const handleGetStarted = () => {
    alert("Welcome to our amazing blog!");
  };

  const handleLearnMore = () => {
    alert("Learn more about our content!");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Rust × Next.js Tech Blog"
        description="モダンな技術スタックで構築された、美しいデザインシステムを持つテックブログです。"
        badges={[
          "Rust",
          "Next.js 16",
          "TypeScript",
          "Tailwind CSS",
          "shadcn/ui",
        ]}
        buttonText="Get Started"
        onButtonClick={handleGetStarted}
      />

      {/* Content Section */}
      <section className="spacing-section bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Content</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our latest articles and tutorials about modern web
              development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ContentCard
              title="Getting Started with Rust"
              description="Learn the basics of Rust programming"
              content="Rust is a systems programming language that runs blazingly fast, prevents segfaults, and guarantees thread safety. In this comprehensive guide, we'll explore the fundamentals of Rust and build your first application."
              buttonText="Read Article"
              onButtonClick={handleLearnMore}
            />

            <ContentCard
              title="Next.js 16 Features"
              description="Explore the latest Next.js capabilities"
              content="Next.js 16 introduces powerful new features including improved App Router, enhanced performance optimizations, and better developer experience. Discover how to leverage these features in your projects."
              buttonText="Learn More"
              onButtonClick={handleLearnMore}
            />

            <ContentCard
              title="Design System with Tailwind"
              description="Building scalable UI components"
              content="Learn how to create a consistent and scalable design system using Tailwind CSS and shadcn/ui components. We'll cover best practices for component architecture and theming."
              buttonText="View Guide"
              onButtonClick={handleLearnMore}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="spacing-section text-center">
        <div className="container mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to Start Building?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of developers who are already using our design system
            to build amazing applications.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg">Start Building</Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <Badge variant="secondary">Open Source</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Modern</Badge>
            <Badge variant="secondary">Scalable</Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
