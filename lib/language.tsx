"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "ar";

export const TRANSLATIONS = {
  en: {
    nav: {
      features: "Features",
      howItWorks: "How It Works",
      pricing: "Pricing",
      docs: "Docs",
      login: "Login",
      getStarted: "Get Started",
      dashboard: "Dashboard",
      switchLabel: "العربية",
    },
    hero: {
      badge: "High-Performance PDF Generation Engine",
      title: "Generate Perfect PDFs from HTML. Instantly.",
      description:
        "Pafyra is a developer-first PDF generation API. Send raw HTML, receive a perfect PDF. Async, scalable, and Arabic-ready with built-in RTL shaping.",
      startForFree: "Start for Free",
      viewDocs: "View Docs",
    },
    socialProof: {
      trustedBy: "Trusted by",
      developers: "developers worldwide",
      rating: "4.9/5",
    },
    featuresHeader: {
      title: "Everything you need for enterprise PDF workflows",
      description: "A developer-focused architecture designed for seamless scale, typographic perfection, and lightning speed.",
    },
    features: [
      {
        title: "HTML to PDF",
        description: "Send full web pages or templates. Puppeteer compiles raw HTML beautifully into absolute A4 documents.",
      },
      {
        title: "Async Processing",
        description: "Jobs are queued instantly via Redis list buffers and parsed sequentially by Puppeteer workers.",
      },
      {
        title: "Arabic & RTL Support",
        description: "Full Arabic typographic shaping and Tajawal/Amiri/Cairo font injection. No broken glyphs, correct RTL margins.",
      },
      {
        title: "API Key Authentication",
        description: "Secure, hashed key configurations. Limit allocations per key and trace API parameters easily.",
      },
      {
        title: "Usage Analytics",
        description: "Audit response speeds, compile ratios, total size, and endpoint requests in detailed dashboard panels.",
      },
      {
        title: "Enterprise Protection",
        description: "Strict monthly limits, Redis-backed rate constraints, HTML size validation, and fully isolated browser tabs.",
      },
    ],
    howItWorksHeader: {
      title: "Integrate in three simple steps",
    },
    howItWorks: [
      {
        step: "01",
        title: "Register & Get Key",
        description: "Create an account in seconds, go to your dashboard, and generate a secure SHA-256 API key.",
      },
      {
        step: "02",
        title: "Send HTML",
        description: "Send a POST request containing your HTML string, format layout, and target font settings.",
      },
      {
        step: "03",
        title: "Download PDF",
        description: "Poll the status endpoint. Once compiled, fetch your ready-made PDF directly from our local file vaults.",
      },
    ],
    footer: {
      product: "Product",
      developers: "Developers",
      legal: "Legal",
      features: "Features",
      pricing: "Pricing",
      howItWorks: "How It Works",
      documentation: "Documentation",
      apiReference: "API Reference",
      arabicGuide: "Arabic & RTL Guide",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      security: "Security SLA",
      copyright: "© {year} Pafyra. All rights reserved.",
      designed: "Designed & developed with precision.",
    },
  },
  ar: {
    nav: {
      features: "الميزات",
      howItWorks: "كيف يعمل",
      pricing: "الأسعار",
      docs: "التوثيق",
      login: "تسجيل دخول",
      getStarted: "ابدأ الآن",
      dashboard: "لوحة التحكم",
      switchLabel: "English",
    },
    hero: {
      badge: "محرك إنشاء ملفات PDF عالي الأداء",
      title: "حوّل HTML إلى PDF مثالي. فوراً.",
      description:
        "Pafyra هو API لإنشاء ملفات PDF مصمم للمطوّرين. أرسل HTML خام واستلم PDF مثالي. غير متزامن، قابل للتوسع، وجاهز للعربية مع تشكيل RTL.",
      startForFree: "ابدأ مجاناً",
      viewDocs: "عرض التوثيق",
    },
    socialProof: {
      trustedBy: "موثوق من",
      developers: "مطوّرين حول العالم",
      rating: "4.9/5",
    },
    featuresHeader: {
      title: "كل ما تحتاجه لتدفقات أعمال PDF على مستوى المؤسسات",
      description: "بنية موجهة للمطورين مصممة للتوسع السلس والدقة الطباعة والسرعة الفائقة.",
    },
    features: [
      {
        title: "من HTML إلى PDF",
        description: "أرسل صفحات الويب أو القوالب. يحول Puppeteer HTML الخام بصورة رائعة إلى مستندات A4.",
      },
      {
        title: "معالجة غير متزامنة",
        description: "يتم وضع الوظائف في قائمة Redis فوراً وتتم معالجتها بالتتابع بواسطة عمال Puppeteer.",
      },
      {
        title: "دعم العربية وRTL",
        description: "التشكيل العربي الكامل وحقن خطوط Tajawal/Amiri/Cairo. لا أحرف مكسورة، وهوامش RTL صحيحة.",
      },
      {
        title: "مصادقة بمفتاح API",
        description: "تكوينات آمنة ومشفرة. حدِّد الحصص لكل مفتاح وتتبع معلمات API بسهولة.",
      },
      {
        title: "تحليلات الاستخدام",
        description: "راجع سرعات الاستجابة ونسب التجميع والحجم الإجمالي وطلبات النقطة النهائية في لوحات تحكم مفصلة.",
      },
      {
        title: "حماية المؤسسات",
        description: "حدود شهرية صارمة، قيود معدّلة بواسطة Redis، التحقق من حجم HTML، وشرائح متصفح معزولة تماماً.",
      },
    ],
    howItWorksHeader: {
      title: "التكامل في ثلاث خطوات بسيطة",
    },
    howItWorks: [
      {
        step: "01",
        title: "سجّل واحصل على مفتاح",
        description: "أنشئ حساباً في ثوانٍ، واذهب إلى لوحة التحكم، وأنشئ مفتاح API SHA-256 آمن.",
      },
      {
        step: "02",
        title: "أرسل HTML",
        description: "أرسل طلب POST يحتوي على سلسلة HTML والتنسيق وإعدادات الخط المستهدف.",
      },
      {
        step: "03",
        title: "حمّل PDF",
        description: "استعلم عن حالة المهمة. بعد التجميع، احصل على PDF الجاهز مباشرة من مستودعات الملفات.",
      },
    ],
    footer: {
      product: "المنتج",
      developers: "المطورين",
      legal: "القانونية",
      features: "الميزات",
      pricing: "الأسعار",
      howItWorks: "كيف يعمل",
      documentation: "التوثيق",
      apiReference: "مرجع API",
      arabicGuide: "دليل العربية وRTL",
      terms: "شروط الخدمة",
      privacy: "سياسة الخصوصية",
      security: "اتفاقية SLA للأمن",
      copyright: "© {year} Pafyra. جميع الحقوق محفوظة.",
      designed: "مصمم ومطور بدقة.",
    },
  },
};

const LanguageContext = createContext<{
  lang: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
} | null>(null);

const STORAGE_KEY = "pafyra_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (savedLanguage === "ar" || savedLanguage === "en") {
      setLang(savedLanguage);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang === "ar" ? "ar" : "en";
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLanguage: (language: Language) => setLang(language),
      toggleLanguage: () => setLang((current) => (current === "en" ? "ar" : "en")),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside a LanguageProvider");
  }
  return context;
}
