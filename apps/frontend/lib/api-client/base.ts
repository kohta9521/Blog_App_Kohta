import type { Locale } from "@/lib/i18n/config";

export class ApiClient {
  private baseUrl: string;
  private locale: Locale;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "", locale: Locale = "ja") {
    this.baseUrl = baseUrl;
    this.locale = locale;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      "Content-Type": "application/json",
      "Accept-Language": this.locale,
      ...options?.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  setLocale(locale: Locale) {
    this.locale = locale;
  }
}

// Factory function to create API client with locale
export const createApiClient = (locale: Locale) => {
  return new ApiClient(process.env.NEXT_PUBLIC_API_URL, locale);
};

