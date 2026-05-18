"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Zap,
  Globe,
  Key,
  BarChart2,
  Shield,
  ArrowRight,
  Terminal,
  Play,
  CheckCircle,
  Copy,
  Check,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useLanguage, TRANSLATIONS } from "@/lib/language";

export default function LandingPage() {
  const [copiedText, setCopiedText] = useState(false);
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang];

  const curlExample = `curl -X POST https://api.pafyra.com/api/v1/pdf/generate \\
  -H "x-api-key: pfy_live_abc123..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "html": "<h1>Invoice #001</h1>",
    "format": "A4",
    "language": "ar"
  }'`;

  const nodeExample = `const axios = require('axios');

const generatePdf = async () => {
  const response = await axios.post('https://api.pafyra.com/api/v1/pdf/generate', {
    html: '<h1>Invoice #001</h1>',
    format: 'A4',
    language: 'ar'
  }, {
    headers: { 'x-api-key': 'pfy_live_abc123...' }
  });
  
  console.log('Job enqueued:', response.data.jobId);
};`;

  const featureCards = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: t.features[0].title,
      description: t.features[0].description,
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: t.features[1].title,
      description: t.features[1].description,
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t.features[2].title,
      description: t.features[2].description,
    },
    {
      icon: <Key className="h-6 w-6" />,
      title: t.features[3].title,
      description: t.features[3].description,
    },
    {
      icon: <BarChart2 className="h-6 w-6" />,
      title: t.features[4].title,
      description: t.features[4].description,
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t.features[5].title,
      description: t.features[5].description,
    },
  ];

  const steps = [
    {
      step: t.howItWorks[0].step,
      title: t.howItWorks[0].title,
      description: t.howItWorks[0].description,
    },
    {
      step: t.howItWorks[1].step,
      title: t.howItWorks[1].title,
      description: t.howItWorks[1].description,
    },
    {
      step: t.howItWorks[2].step,
      title: t.howItWorks[2].title,
      description: t.howItWorks[2].description,
    },
  ];

  const handleCopyCode = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(true);
    toast.success("Code snippet copied!");
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="flex flex-col items-center">
      {/* ────────────────── 1. HERO SECTION ────────────────── */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-7xl mx-auto px-6 pt-20 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10"
      >
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold animate-pulse">
            <Zap className="h-3.5 w-3.5" /> {t.hero.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-foreground leading-[1.08]">
            {t.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
            {t.hero.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 w-full mt-2">
            <Link href="/register">
              <Button size="lg" className="rounded-xl shadow-lg shadow-indigo-500/20 px-8 cursor-pointer">
                {t.hero.startForFree} <ArrowRight className="h-4.5 w-4.5 ml-2" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg" className="rounded-xl px-8 hover:bg-muted/80 cursor-pointer">
                {t.hero.viewDocs}
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Code Block Card */}
        <div className="lg:col-span-5 w-full">
          <Card className="border border-border/80 bg-zinc-950/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/5">
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-mono text-zinc-500">terminal - pafyra</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded"
                onClick={() => handleCopyCode(curlExample)}
              >
                {copiedText ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
            <CardContent className="p-4 bg-zinc-950 font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto select-all">
              <pre className="whitespace-pre">{curlExample}</pre>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* ────────────────── 2. SOCIAL PROOF BAR ────────────────── */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full border-t border-b border-border/40 bg-muted/20 py-8 z-10"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <span className="h-8 w-8 rounded-full bg-indigo-600 border border-background flex items-center justify-center text-[10px] font-bold text-white">JD</span>
              <span className="h-8 w-8 rounded-full bg-violet-600 border border-background flex items-center justify-center text-[10px] font-bold text-white">AS</span>
              <span className="h-8 w-8 rounded-full bg-emerald-600 border border-background flex items-center justify-center text-[10px] font-bold text-white">MK</span>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {t.socialProof.trustedBy} <span className="text-foreground font-bold">2,000+ {t.socialProof.developers}</span>
            </div>
          </div>
          <div className="flex items-center gap-6 opacity-60">
            <span className="font-heading font-extrabold tracking-widest text-lg">ACME CORP</span>
            <span className="font-heading font-extrabold tracking-widest text-lg">TECHLABS</span>
            <span className="font-heading font-extrabold tracking-widest text-lg">SAASIFY</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-500">
            <Star className="h-4 w-4 fill-amber-500" />
            <Star className="h-4 w-4 fill-amber-500" />
            <Star className="h-4 w-4 fill-amber-500" />
            <Star className="h-4 w-4 fill-amber-500" />
            <Star className="h-4 w-4 fill-amber-500" />
            <span className="text-sm font-bold text-foreground ml-1">4.9/5</span>
          </div>
        </div>
      </motion.section>

      {/* ────────────────── 3. FEATURES GRID ────────────────── */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        id="features" 
        className="w-full max-w-7xl mx-auto px-6 py-24 z-10 text-center"
      >
        <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto mb-16">
          <span className="text-sm font-bold text-primary uppercase tracking-wider">{t.nav.features}</span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
            {t.featuresHeader.title}
          </h2>
          <p className="text-base text-muted-foreground">
            {t.featuresHeader.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCards.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="border border-border/60 bg-card/40 backdrop-blur-sm rounded-xl text-left hover:border-primary/40 hover:shadow-lg hover:shadow-primary/[0.02] transition-all duration-300">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ────────────────── 4. HOW IT WORKS ────────────────── */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        id="how-it-works" 
        className="w-full border-t border-border/40 bg-muted/10 py-24 z-10"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto mb-16">
            <span className="text-sm font-bold text-primary uppercase tracking-wider">{t.nav.howItWorks}</span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
              {t.howItWorksHeader.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            {steps.map((stepper, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex flex-col items-center text-center gap-4 relative z-10"
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-heading font-extrabold text-2xl">
                  {stepper.step}
                </div>
                <h3 className="text-xl font-bold text-foreground">{stepper.title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  {stepper.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ────────────────── 5. CODE SNIPPET SECTION ────────────────── */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl mx-auto px-6 py-24 z-10"
      >
        <Card className="border border-border/80 bg-zinc-950/90 rounded-2xl overflow-hidden shadow-2xl">
          <Tabs defaultValue="curl" className="w-full">
            <div className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-zinc-400">Developer SDK Integration</span>
              </div>
              <TabsList className="bg-zinc-800/80 rounded-lg p-1">
                <TabsTrigger value="curl" className="text-xs font-semibold rounded-md data-[state=active]:bg-zinc-950 data-[state=active]:text-white">
                  cURL
                </TabsTrigger>
                <TabsTrigger value="node" className="text-xs font-semibold rounded-md data-[state=active]:bg-zinc-950 data-[state=active]:text-white">
                  Node.js (Axios)
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="curl" className="p-6 bg-zinc-950 font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto relative">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded"
                onClick={() => handleCopyCode(curlExample)}
              >
                {copiedText ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
              <pre className="whitespace-pre">{curlExample}</pre>
            </TabsContent>

            <TabsContent value="node" className="p-6 bg-zinc-950 font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto relative">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded"
                onClick={() => handleCopyCode(nodeExample)}
              >
                {copiedText ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
              <pre className="whitespace-pre">{nodeExample}</pre>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.section>

      {/* ────────────────── 6. PRICING PREVIEW ────────────────── */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="w-full border-t border-border/40 bg-muted/5 py-24 z-10"
      >
        <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Pricing</span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
              Fair, transparent pricing for all sizes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            {/* Free Plan Card */}
            <Card className="border border-border/60 bg-card rounded-xl text-left hover:border-primary/30 transition-all">
              <CardContent className="p-8 flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Free Plan</h3>
                  <p className="text-sm text-muted-foreground mt-1">Perfect for local development & testing</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">$0</span>
                  <span className="text-muted-foreground text-sm">/ month</span>
                </div>
                <ul className="flex flex-col gap-3 border-t border-border/60 pt-6">
                  {["100 PDFs / month", "A4, Letter, Legal formats", "API Access", "Arabic & RTL Support", "10 second timeout"].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="h-4.5 w-4.5 text-primary flex-shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="mt-4">
                  <Button variant="outline" className="w-full rounded-lg cursor-pointer">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan Card */}
            <Card className="border-2 border-primary bg-card rounded-xl text-left relative shadow-xl shadow-primary/[0.02]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-semibold px-3 py-1 rounded-full text-xs tracking-wider uppercase">
                Most Popular
              </div>
              <CardContent className="p-8 flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Pro Plan</h3>
                  <p className="text-sm text-muted-foreground mt-1">Scale up your SaaS or enterprise systems</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">$19</span>
                  <span className="text-muted-foreground text-sm">/ month</span>
                </div>
                <ul className="flex flex-col gap-3 border-t border-border/60 pt-6">
                  {["Unlimited PDFs", "All formats + custom sizes", "Priority Queueing", "Webhooks on Complete", "Custom font uploads", "Arabic & RTL support", "30 second timeout", "Priority Email Support"].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing" className="mt-4">
                  <Button className="w-full rounded-lg cursor-pointer">
                    Upgrade to Pro
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <Link href="/pricing">
            <Button variant="link" className="text-sm font-semibold text-primary flex items-center gap-1 cursor-pointer">
              Compare all plans & features <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* ────────────────── 7. TESTIMONIALS ────────────────── */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-7xl mx-auto px-6 py-24 z-10 text-center"
      >
        <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto mb-16">
          <span className="text-sm font-bold text-primary uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
            What fellow engineers say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "The Arabic rendering is absolute sorcery. Standard platforms broke our typography completely, but Pafyra shapes fonts perfectly out of the box.",
              author: "Ahmed Al-Farsi",
              role: "Tech Lead at Fintech KSA",
            },
            {
              quote: "Extremely easy integration. We replaced our clumsy custom HTML-to-PDF server setup with simple Pafyra API calls. The queueing holds up flawlessly.",
              author: "Sarah Jenkins",
              role: "Senior Backend Developer at SaaSify",
            },
            {
              quote: "The response rates and usage charts give our ops team extreme transparency. Revoking and generating API keys is totally seamless.",
              author: "Marcus Chen",
              role: "VP of Engineering at ACME Logistics",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <Card className="border border-border/40 bg-card/30 backdrop-blur-sm rounded-xl text-left h-full">
                <CardContent className="p-6 flex flex-col justify-between h-full gap-6">
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    "{item.quote}"
                  </p>
                  <div className="flex items-center gap-3 border-t border-border/40 pt-4">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-heading font-extrabold text-sm">
                      {item.author.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{item.author}</h4>
                      <p className="text-xs text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ────────────────── 8. CTA BANNER ────────────────── */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-7xl mx-auto px-6 pb-24 z-10"
      >
        <div className="w-full bg-gradient-to-r from-primary to-indigo-600 rounded-3xl p-12 text-center flex flex-col items-center gap-6 shadow-xl shadow-primary/10">
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-white max-w-2xl">
            Start generating beautiful PDFs today
          </h2>
          <p className="text-white/80 max-w-md text-sm md:text-base leading-relaxed">
            Create an account, grab your free API keys, and compile your HTML documents in under two minutes.
          </p>
          <Link href="/register" className="mt-4">
            <Button size="lg" className="bg-white hover:bg-zinc-100 text-primary font-bold px-8 rounded-xl shadow-lg cursor-pointer">
              Get Started Free
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
