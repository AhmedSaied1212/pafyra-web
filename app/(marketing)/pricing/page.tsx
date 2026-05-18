"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free Plan",
      description: "Perfect for local development & sandboxing.",
      price: "$0",
      period: "/ month",
      actionText: "Get Started Free",
      actionHref: "/register",
      variant: "outline" as const,
      features: [
        { text: "100 PDFs / month", included: true },
        { text: "A4, Letter, Legal formats", included: true },
        { text: "Standard API access", included: true },
        { text: "Arabic & RTL shaping support", included: true },
        { text: "10 second render timeout", included: true },
        { text: "Priority job queueing", included: false },
        { text: "Webhook completion alerts", included: false },
        { text: "Custom font integrations", included: false },
      ],
    },
    {
      name: "Pro Plan",
      description: "Scale up your production SaaS or company layouts.",
      price: isAnnual ? "$15" : "$19",
      period: "/ month",
      actionText: "Start Pro →",
      actionHref: "/register",
      variant: "default" as const,
      highlight: true,
      badge: "Most Popular",
      features: [
        { text: "Unlimited PDFs", included: true },
        { text: "All formats + custom sizes", included: true },
        { text: "Priority job queueing", included: true },
        { text: "Webhook completion alerts", included: true },
        { text: "Custom font integrations", included: true },
        { text: "Arabic & RTL shaping support", included: true },
        { text: "30 second render timeout", included: true },
        { text: "Email support channel", included: true },
      ],
    },
    {
      name: "Enterprise",
      description: "Custom parameters for high-volume corporate setups.",
      price: "Custom",
      period: "",
      actionText: "Contact Sales",
      actionHref: "mailto:sales@pafyra.com",
      variant: "outline" as const,
      features: [
        { text: "Everything in Pro plan", included: true },
        { text: "Isolated dedicated workers", included: true },
        { text: "SLA performance guarantee", included: true },
        { text: "SSO / SAML authentications", included: true },
        { text: "Custom rate allocations", included: true },
        { text: "Slack & priority support", included: true },
      ],
    },
  ];

  const faqs = [
    {
      id: "faq-1",
      question: "How does the monthly PDF quota limit work?",
      answer: "Under the Free Plan, you have 100 PDF renders each calendar month. The count resets on the 1st of every month. The Pro Plan has unlimited compiles, and you're only limited by standard database rate limits.",
    },
    {
      id: "faq-2",
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, absolutely! You can cancel or downgrade your subscription directly inside your billing settings at any time. When cancelled, your plan will remain active until the end of the current billing cycle.",
    },
    {
      id: "faq-3",
      question: "Is Arabic text rendering really guaranteed to look right?",
      answer: "Yes! Unlike most generic HTML-to-PDF APIs that render disconnected glyphs or backwards words, Pafyra automatically shapes Arabic fonts, embeds Cairo/Amiri properly, and forces standard CSS directionality (RTL) for Arabic contexts.",
    },
    {
      id: "faq-4",
      question: "What happens if a rendering job times out?",
      answer: "Free jobs have a 10s timeout, while Pro jobs run for up to 30s. If a compile fails due to a timeout, it is enqueued again or flagged as failed in your history, and you are NOT charged a monthly quota count for failed compilations.",
    },
    {
      id: "faq-5",
      question: "Do you offer custom SLA options for high-volume setups?",
      answer: "Yes! Under our Enterprise Plan, we can provision dedicated worker processes, secure custom font vaults, handle custom Page sizes, and sign formal SLA uptime agreements. Reach out to sales@pafyra.com for detailed inquiries.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
      {/* Page Title Header */}
      <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-foreground leading-[1.1]">
          Transparent, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">flexible pricing</span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
          Get started for free and upgrade as your PDF volume scales. Save 20% by subscribing to annual billing.
        </p>

        {/* Monthly/Annual Toggle Switch */}
        <div className="flex items-center gap-3 bg-muted/40 p-2 rounded-xl border border-border/80 mt-6 select-none">
          <Label htmlFor="billing-toggle" className={`text-sm font-semibold cursor-pointer ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="data-[state=checked]:bg-primary"
          />
          <Label htmlFor="billing-toggle" className={`text-sm font-semibold cursor-pointer flex items-center gap-1.5 ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
            Annually <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Save 20%</span>
          </Label>
        </div>
      </div>

      {/* Plan Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mt-6 items-start">
        {plans.map((plan, idx) => (
          <Card
            key={idx}
            className={`border rounded-2xl relative shadow-xl hover:shadow-2xl transition-all duration-300 ${
              plan.highlight
                ? "border-primary bg-card/60 shadow-primary/[0.01]"
                : "border-border/60 bg-card/40 backdrop-blur-sm"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-semibold px-3 py-1 rounded-full text-xs tracking-wider uppercase">
                {plan.badge}
              </div>
            )}
            <CardContent className="p-8 flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 min-h-[40px] leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1 border-b border-border/60 pb-6">
                <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-sm font-medium">
                  {plan.period}
                </span>
              </div>

              <ul className="flex flex-col gap-4">
                {plan.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-start gap-3 text-sm">
                    {feat.included ? (
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4.5 w-4.5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feat.included ? "text-foreground/90 font-medium" : "text-muted-foreground/50 line-through"}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.actionHref} className="mt-4">
                <Button variant={plan.variant} className="w-full rounded-xl py-5 font-bold cursor-pointer">
                  {plan.actionText}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Accordion FAQ Section */}
      <div className="w-full max-w-4xl border-t border-border/60 mt-24 pt-20 flex flex-col items-center gap-12">
        <div className="flex flex-col items-center text-center gap-3 max-w-xl mx-auto">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Got questions? We've got answers. Explore our support topics below or email team@pafyra.com.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border-b border-border/60">
              <AccordionTrigger className="text-left font-bold text-base py-4 hover:no-underline hover:text-primary transition-colors cursor-pointer">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
