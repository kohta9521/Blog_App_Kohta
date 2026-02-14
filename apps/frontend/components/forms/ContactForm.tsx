"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

interface ContactFormProps {
  lang: Locale;
  contact: NonNullable<Dictionary["contact"]>;
}

export function ContactForm({ lang, contact }: ContactFormProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formState.name.trim()) {
      newErrors.name = contact.form.name.required;
    }

    if (!formState.email.trim()) {
      newErrors.email = contact.form.email.required;
    } else if (!validateEmail(formState.email)) {
      newErrors.email = contact.form.email.invalid;
    }

    if (!formState.category) {
      newErrors.category = contact.form.category.required;
    }

    if (!formState.message.trim()) {
      newErrors.message = contact.form.message.required;
    }

    if (!formState.agreedToTerms) {
      newErrors.agreedToTerms = contact.form.agreement.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      console.log("Submitting form data:", {
        name: formState.name,
        email: formState.email,
        category: formState.category,
        message: formState.message,
        lang: lang,
      });

      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("email", formState.email);
      formData.append("category", formState.category);
      formData.append("message", formState.message);
      formData.append("lang", lang);

      const response = await fetch("https://kohta-engineer-portfolio.form.newt.so/v1/RqLXd0DCc", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        setSubmitStatus("success");
        // Redirect to complete page
        setTimeout(() => {
          window.location.href = `/${lang}/contact/complete`;
        }, 1000);
      } else {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("Network error: Check CORS settings or network connection");
      }
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormState((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-mono font-medium"
          >
            {contact.form.name.label}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              placeholder={contact.form.name.placeholder}
              className={`w-full px-4 py-3 text-sm font-mono border rounded-sm bg-background transition-all duration-200 ${
                focusedField === "name"
                  ? "border-foreground ring-1 ring-foreground"
                  : "border-border"
              } ${errors.name ? "border-red-500" : ""}`}
            />
            {focusedField === "name" && (
              <div className="absolute inset-0 -z-10 bg-foreground/5 rounded-sm animate-pulse" />
            )}
          </div>
          {errors.name && (
            <p className="text-xs text-red-500 font-mono animate-in fade-in slide-in-from-top-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-mono font-medium"
          >
            {contact.form.email.label}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder={contact.form.email.placeholder}
              className={`w-full px-4 py-3 text-sm font-mono border rounded-sm bg-background transition-all duration-200 ${
                focusedField === "email"
                  ? "border-foreground ring-1 ring-foreground"
                  : "border-border"
              } ${errors.email ? "border-red-500" : ""}`}
            />
            {focusedField === "email" && (
              <div className="absolute inset-0 -z-10 bg-foreground/5 rounded-sm animate-pulse" />
            )}
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 font-mono animate-in fade-in slide-in-from-top-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Category Field */}
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-mono font-medium"
          >
            {contact.form.category.label}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={formState.category}
              onChange={handleChange}
              onFocus={() => setFocusedField("category")}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 text-sm font-mono border rounded-sm bg-background transition-all duration-200 appearance-none cursor-pointer ${
                focusedField === "category"
                  ? "border-foreground ring-1 ring-foreground"
                  : "border-border"
              } ${errors.category ? "border-red-500" : ""}`}
            >
              <option value="">{contact.form.category.placeholder}</option>
              <option value="web_development">
                {contact.form.category.options.web_development}
              </option>
              <option value="technical_consulting">
                {contact.form.category.options.technical_consulting}
              </option>
              <option value="event_planning">
                {contact.form.category.options.event_planning}
              </option>
              <option value="business_collaboration">
                {contact.form.category.options.business_collaboration}
              </option>
              <option value="speaking">
                {contact.form.category.options.speaking}
              </option>
              <option value="interview">
                {contact.form.category.options.interview}
              </option>
              <option value="student_inquiry">
                {contact.form.category.options.student_inquiry}
              </option>
              <option value="other">
                {contact.form.category.options.other}
              </option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {focusedField === "category" && (
              <div className="absolute inset-0 -z-10 bg-foreground/5 rounded-sm animate-pulse" />
            )}
          </div>
          {errors.category && (
            <p className="text-xs text-red-500 font-mono animate-in fade-in slide-in-from-top-1">
              {errors.category}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="block text-sm font-mono font-medium"
          >
            {contact.form.message.label}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <textarea
              id="message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              onFocus={() => setFocusedField("message")}
              onBlur={() => setFocusedField(null)}
              placeholder={contact.form.message.placeholder}
              rows={6}
              className={`w-full px-4 py-3 text-sm font-mono border rounded-sm bg-background transition-all duration-200 resize-none ${
                focusedField === "message"
                  ? "border-foreground ring-1 ring-foreground"
                  : "border-border"
              } ${errors.message ? "border-red-500" : ""}`}
            />
            {focusedField === "message" && (
              <div className="absolute inset-0 -z-10 bg-foreground/5 rounded-sm animate-pulse" />
            )}
          </div>
          {errors.message && (
            <p className="text-xs text-red-500 font-mono animate-in fade-in slide-in-from-top-1">
              {errors.message}
            </p>
          )}
        </div>

        {/* Agreement Checkbox */}
        <div className="space-y-2 pt-2">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreedToTerms"
              name="agreedToTerms"
              checked={formState.agreedToTerms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 border border-border rounded-sm cursor-pointer"
            />
            <label
              htmlFor="agreedToTerms"
              className="text-xs font-mono text-muted-foreground cursor-pointer"
            >
              {lang === "ja" ? (
                <>
                  <Link
                    href={`/${lang}/legal/terms`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground transition-colors"
                  >
                    {contact.form.agreement.terms}
                  </Link>
                  {contact.form.agreement.and}
                  <Link
                    href={`/${lang}/legal/privacy`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground transition-colors"
                  >
                    {contact.form.agreement.privacy}
                  </Link>
                  に同意する
                </>
              ) : (
                <>
                  I agree to the{" "}
                  <Link
                    href={`/${lang}/legal/terms`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground transition-colors"
                  >
                    {contact.form.agreement.terms}
                  </Link>
                  {" "}{contact.form.agreement.and}{" "}
                  <Link
                    href={`/${lang}/legal/privacy`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground transition-colors"
                  >
                    {contact.form.agreement.privacy}
                  </Link>
                </>
              )}
              <span className="text-red-500 ml-1">*</span>
            </label>
          </div>
          {errors.agreedToTerms && (
            <p className="text-xs text-red-500 font-mono animate-in fade-in slide-in-from-top-1">
              {errors.agreedToTerms}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6 flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative px-12 py-3 font-mono text-sm border rounded-sm transition-all duration-300 hover:bg-foreground hover:text-background disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <span className="relative z-10">
              {isSubmitting ? contact.form.submitting : contact.form.submit}
            </span>
            {!isSubmitting && (
              <span className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:right-3 transition-all duration-300">
                →
              </span>
            )}
            {isSubmitting && (
              <span className="absolute inset-0 bg-foreground/10 animate-pulse" />
            )}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="p-4 border border-green-500 rounded-sm bg-green-500/10 animate-in fade-in slide-in-from-top-2">
            <p className="text-sm font-mono text-green-600 dark:text-green-400">
              ✓ {contact.form.success}
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="p-4 border border-red-500 rounded-sm bg-red-500/10 animate-in fade-in slide-in-from-top-2">
            <p className="text-sm font-mono text-red-600 dark:text-red-400">
              ✕ {contact.form.error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
