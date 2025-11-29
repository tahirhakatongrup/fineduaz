import { useLanguage } from "@/lib/language-context";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  BookOpen, 
  CreditCard, 
  Home, 
  ShieldAlert,
} from "lucide-react";

export default function Education() {
  const { t } = useLanguage();

  const educationSections = [
    {
      id: "credit",
      icon: CreditCard,
      title: t.education.credit.title,
      content: t.education.credit.content,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      id: "mortgage",
      icon: Home,
      title: t.education.mortgage.title,
      content: t.education.mortgage.content,
      color: "text-violet-500",
      bgColor: "bg-violet-50 dark:bg-violet-950/30",
    },
    {
      id: "fraud",
      icon: ShieldAlert,
      title: t.education.fraud.title,
      content: t.education.fraud.content,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/30",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-violet-500 mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold" data-testid="text-education-title">
            {t.education.title}
          </h1>
        </div>

        {/* Education Cards with Accordion */}
        <div className="space-y-4">
          {educationSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card 
                key={section.id} 
                className="overflow-hidden"
                data-testid={`education-card-${section.id}`}
              >
                <Accordion type="single" collapsible>
                  <AccordionItem value={section.id} className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${section.bgColor}`}>
                          <Icon className={`w-6 h-6 ${section.color}`} />
                        </div>
                        <span className="text-xl font-semibold text-left">
                          {section.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="pl-[52px]">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            );
          })}
        </div>

        {/* Quick Tips */}
        <Card className="bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 border-violet-200 dark:border-violet-800">
          <CardHeader>
            <CardTitle className="text-lg">
              {t.language === "az" && "Sürətli Məsləhətlər"}
              {t.language === "en" && "Quick Tips"}
              {t.language === "ru" && "Быстрые советы"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                {
                  az: "Gəlirinizin ən azı 20%-ni qənaət edin",
                  en: "Save at least 20% of your income",
                  ru: "Откладывайте минимум 20% дохода",
                },
                {
                  az: "Kredit kartı borcunu vaxtında ödəyin",
                  en: "Pay credit card bills on time",
                  ru: "Оплачивайте кредитную карту вовремя",
                },
                {
                  az: "Təcili xərclər üçün 3-6 aylıq fond yaradın",
                  en: "Build a 3-6 month emergency fund",
                  ru: "Создайте резервный фонд на 3-6 месяцев",
                },
                {
                  az: "Büdcənizi planlaşdırın və izləyin",
                  en: "Plan and track your budget",
                  ru: "Планируйте и отслеживайте бюджет",
                },
              ].map((tip, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3"
                  data-testid={`tip-${index}`}
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm">
                    {tip[t.language as keyof typeof tip] || tip.en}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
