import { SITE_CONFIG } from '../data/site-config';
import type { BrandFaq } from '../types/airport';
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${SITE_CONFIG.name} ${SITE_CONFIG.englishName}`,
    url: SITE_CONFIG.domain,
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.domain}/search/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.englishName,
    url: SITE_CONFIG.domain,
    email: SITE_CONFIG.email,
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_CONFIG.domain}${item.href}` } : {}),
    })),
  };
}

export function buildWebPageSchema(opts: {
  title: string;
  description: string;
  path: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: opts.title,
    description: opts.description,
    url: `${SITE_CONFIG.domain}${opts.path}`,
    inLanguage: 'zh-CN',
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
  };
}

export function buildCollectionSchema(opts: {
  title: string;
  description: string;
  path: string;
  items: { name: string; url: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.title,
    description: opts.description,
    url: `${SITE_CONFIG.domain}${opts.path}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: opts.items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        url: `${SITE_CONFIG.domain}${item.url}`,
      })),
    },
  };
}

export function buildBlogPostingSchema(opts: {
  title: string;
  description: string;
  path: string;
  publishDate: string;
  updatedDate: string;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: `${SITE_CONFIG.domain}${opts.path}`,
    datePublished: opts.publishDate,
    dateModified: opts.updatedDate,
    inLanguage: 'zh-CN',
    author: {
      '@type': 'Organization',
      name: opts.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.domain,
    },
  };
}

export function buildFaqSchema(faqs: BrandFaq[]) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
