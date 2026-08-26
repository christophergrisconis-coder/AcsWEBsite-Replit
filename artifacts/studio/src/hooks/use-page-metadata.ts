import { useEffect } from "react";

const siteName = "Advanced Creation Studio";
const siteUrl = "https://advancedcreationstudio.com";
const defaultImage = "/acs-og-image.svg";

interface PageMetadataOptions {
  image?: string;
  path?: string;
  type?: "website" | "article";
  robots?: string;
  structuredData?: Record<string, unknown>;
}

function absoluteUrl(value: string) {
  return new URL(value, siteUrl).toString();
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export function usePageMetadata(
  title: string,
  description: string,
  options: PageMetadataOptions = {},
) {
  useEffect(() => {
    const pageTitle = `${title} | ${siteName}`;
    const pagePath =
      options.path ??
      `${window.location.pathname}${window.location.search.replace(/(?:^|&)noprint=1&?/, "").replace(/[?&]$/, "")}`;
    const canonicalUrl = absoluteUrl(pagePath);
    const imageUrl = absoluteUrl(options.image ?? defaultImage);

    document.title = pageTitle;
    setMeta("name", "description", description);
    setMeta("name", "robots", options.robots ?? "index,follow");
    setMeta("property", "og:title", pageTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:type", options.type ?? "website");
    setMeta("property", "og:site_name", siteName);
    setMeta("property", "og:image", imageUrl);
    setMeta("property", "og:image:alt", `${title} — ${siteName}`);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", pageTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:url", canonicalUrl);
    setMeta("name", "twitter:image", imageUrl);

    let canonicalTag = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.rel = "canonical";
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = canonicalUrl;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: pageTitle,
      description,
      url: canonicalUrl,
      isPartOf: {
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
      },
      ...(options.structuredData ?? {}),
    };
    let jsonLd = document.querySelector<HTMLScriptElement>(
      'script[data-page-structured-data="true"]',
    );
    if (!jsonLd) {
      jsonLd = document.createElement("script");
      jsonLd.type = "application/ld+json";
      jsonLd.dataset.pageStructuredData = "true";
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify(structuredData);
  }, [title, description, options]);
}
