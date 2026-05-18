export const PLAN_LIMITS = {
  FREE: {
    name: "Free",
    price: "$0",
    limit: 100,
    features: [
      "100 PDFs / month",
      "A4, Letter, Legal formats",
      "API access",
      "Arabic & RTL support",
      "10 second timeout",
    ],
    missing: ["Priority queue", "Webhooks", "Custom fonts"],
  },
  PRO: {
    name: "Pro",
    price: "$19",
    annualPrice: "$15",
    limit: 1000000, // Unlimited mock
    features: [
      "Unlimited PDFs",
      "All formats + custom sizes",
      "Priority queue",
      "Webhooks on job complete",
      "Custom font upload",
      "Arabic & RTL support",
      "30 second timeout",
      "Email support",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: "Custom",
    limit: 99999999,
    features: [
      "Everything in Pro",
      "Dedicated worker",
      "SLA guarantee",
      "SSO / SAML",
      "Custom rate limits",
      "Slack support",
    ],
  },
};

export const DOCS_NAV = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", slug: "introduction" },
      { title: "Quick Start", slug: "quick-start" },
      { title: "Authentication", slug: "authentication" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "Generate PDF", slug: "generate-pdf" },
      { title: "Job Status", slug: "job-status" },
      { title: "API Keys", slug: "api-keys" },
      { title: "Error Codes", slug: "error-codes" },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Arabic & RTL PDFs", slug: "arabic-rtl" },
      { title: "Invoice Templates", slug: "invoice-templates" },
      { title: "Custom Fonts", slug: "custom-fonts" },
      { title: "Webhooks", slug: "webhooks" },
    ],
  },
  {
    title: "SDKs & Tools",
    items: [
      { title: "Node.js SDK", slug: "nodejs-sdk" },
      { title: "Python SDK", slug: "python-sdk" },
      { title: "Postman Collection", slug: "postman-collection" },
    ],
  },
];
