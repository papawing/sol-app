"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const t = useTranslations("contactPage");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: t("form.successTitle"),
          description: t("form.successMessage"),
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast({
          title: t("form.errorTitle"),
          description: t("form.errorMessage"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("form.errorTitle"),
        description: t("form.errorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t("info.emailTitle"),
      content: "hello@lune-roppongi.jp",
      link: "mailto:hello@lune-roppongi.jp",
    },
    {
      icon: MapPin,
      title: t("info.locationTitle"),
      content: t("info.locationContent"),
      link: null,
    },
    {
      icon: Clock,
      title: t("info.hoursTitle"),
      content: t("info.hoursContent"),
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-deep via-hof to-deep py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-mint/30 to-transparent blur-3xl rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-radial from-teal/30 to-transparent blur-3xl rounded-full"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6 animate-fade-in-up">💬</div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-display font-bold text-deep mb-6">
                {t("form.title")}
              </h2>
              <p className="text-lg text-light mb-8">
                {t("form.subtitle")}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-deep mb-2">
                    {t("form.name")} <span className="text-rausch">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("form.namePlaceholder")}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-deep mb-2">
                    {t("form.email")} <span className="text-rausch">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("form.emailPlaceholder")}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-deep mb-2">
                    {t("form.subject")} <span className="text-rausch">*</span>
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t("form.subjectPlaceholder")}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-deep mb-2">
                    {t("form.message")} <span className="text-rausch">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("form.messagePlaceholder")}
                    rows={6}
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF5A5F] hover:bg-[#E61E4D] text-white text-lg py-6 rounded-airbnb-lg shadow-airbnb-xl hover:scale-105 transition-transform duration-base"
                >
                  {isSubmitting ? t("form.sending") : t("form.submit")}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-display font-bold text-deep mb-6">
                {t("info.title")}
              </h2>
              <p className="text-lg text-light mb-8">
                {t("info.subtitle")}
              </p>

              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-airbnb-xl p-6 border border-gray-200 hover:border-teal/50 transition-colors duration-base"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal/10 to-mint/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-teal" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-deep mb-1">
                            {item.title}
                          </h3>
                          {item.link ? (
                            <a
                              href={item.link}
                              className="text-teal hover:text-deep-teal underline"
                            >
                              {item.content}
                            </a>
                          ) : (
                            <p className="text-light">{item.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Additional Info Box */}
              <div className="mt-8 bg-gradient-to-br from-mint/10 to-teal/10 rounded-airbnb-xl p-6 border border-teal/20">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-6 h-6 text-teal flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-deep mb-2">
                      {t("info.responseTitle")}
                    </h3>
                    <p className="text-light text-sm">
                      {t("info.responseContent")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-white/50 text-sm text-center">
            © 2025 SOL. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
