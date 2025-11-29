import { Link } from "wouter";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  Target,
  Users,
  Zap,
  ArrowRight,
  Check,
} from "lucide-react";

export default function Landing() {
  const { t, language, setLanguage } = useLanguage();
  const { theme } = useTheme();

  const features = [
    {
      icon: TrendingUp,
      titleAz: "Xərclərini İzlə",
      titleEn: "Track Expenses",
      titleRu: "Отслеживайте расходы",
      descAz: "Hər bir xərci kateqoriya ilə qeyd et",
      descEn: "Categorize every expense",
      descRu: "Категоризируйте каждый расход",
    },
    {
      icon: Target,
      titleAz: "Məqsədlər Qoy",
      titleEn: "Set Goals",
      titleRu: "Установите цели",
      descAz: "Maliyyə məqsədlərinə çat",
      descEn: "Achieve financial goals",
      descRu: "Достигайте финансовых целей",
    },
    {
      icon: Users,
      titleAz: "Dostlarla Yarış",
      titleEn: "Challenge Friends",
      titleRu: "Соревнуйтесь с друзьями",
      descAz: "Qənaət oyununda iştirak et",
      descEn: "Join savings competition",
      descRu: "Участвуйте в конкурсе сбережений",
    },
    {
      icon: Zap,
      titleAz: "AI Məsləhətlər",
      titleEn: "AI Advice",
      titleRu: "Советы ИИ",
      descAz: "Finny-dən şəxsi tövsiyə al",
      descEn: "Get personalized advice",
      descRu: "Получайте персональные советы",
    },
  ];

  const getFeatureTitle = (item: any) => {
    if (language === "az") return item.titleAz;
    if (language === "ru") return item.titleRu;
    return item.titleEn;
  };

  const getFeatureDesc = (item: any) => {
    if (language === "az") return item.descAz;
    if (language === "ru") return item.descRu;
    return item.descEn;
  };

  const titles = {
    az: {
      main: "FinEdu — Şəxsi maliyyəni ağıllı idarə et!",
      sub: "Xərclərini izlə, büdcə planla, məqsədlərinə daha tez çat.",
      start: "İndi başla",
      learn: "Daha çox öyrən",
      features: "Xüsusiyyətlər",
      trusted: "1,000+ fəal istifadəçi",
    },
    en: {
      main: "FinEdu — Manage Your Finances Smartly!",
      sub: "Track expenses, plan budgets, reach your goals faster.",
      start: "Get Started",
      learn: "Learn More",
      features: "Features",
      trusted: "1,000+ active users",
    },
    ru: {
      main: "FinEdu — Умное управление личными финансами!",
      sub: "Отслеживайте расходы, планируйте бюджет, достигайте целей быстрее.",
      start: "Начать",
      learn: "Узнать больше",
      features: "Возможности",
      trusted: "1000+ активных пользователей",
    },
  };

  const current = titles[language as keyof typeof titles];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-xl text-foreground">FinEdu</span>
          </div>

          {/* Nav + Controls */}
          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={(v) => setLanguage(v as any)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="az">Azərbaycanca</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
              </SelectContent>
            </Select>

            <ThemeToggle />

            <Link href="/login">
              <Button variant="outline" size="sm">
                {language === "az" ? "Daxil ol" : language === "ru" ? "Вход" : "Login"}
              </Button>
            </Link>

            <Link href="/login">
              <Button size="sm">
                {language === "az" ? "Qeydiyyat" : language === "ru" ? "Регистрация" : "Sign Up"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-violet-500 border-2 border-background"
                />
              ))}
            </div>
            <span className="text-sm font-medium text-primary">{current.trusted}</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
              {current.main}
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl">
              {current.sub}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/login">
              <Button size="lg" className="gap-2 px-8">
                {current.start}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="px-8">
                {current.learn}
              </Button>
            </Link>
          </div>

          {/* Illustration placeholder */}
          <div className="mt-12 relative h-64 rounded-2xl bg-gradient-to-b from-primary/20 to-violet-500/20 border border-primary/20 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="text-center">
              <TrendingUp className="w-20 h-20 mx-auto text-primary opacity-50 mb-4" />
              <p className="text-muted-foreground">{current.features}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{current.features}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">
                  {getFeatureTitle(item)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {getFeatureDesc(item)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-violet-600 p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              {language === "az"
                ? "Maliyyə azadlığına doğru ilk addımı at"
                : language === "ru"
                ? "Сделай первый шаг к финансовой свободе"
                : "Take Your First Step to Financial Freedom"}
            </h2>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="gap-2">
                {current.start}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 FinEdu AZ. {language === "az" ? "Bütün hüquqlar qorunur." : language === "ru" ? "Все права защищены." : "All rights reserved."}</p>
        </div>
      </footer>
    </div>
  );
}
