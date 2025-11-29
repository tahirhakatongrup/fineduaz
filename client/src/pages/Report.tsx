import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
  Bot,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { Transaction, Averages } from "@shared/schema";

export default function Report() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: !!user,
  });

  const { data: averages, isLoading: averagesLoading } = useQuery<Averages>({
    queryKey: ["/api/averages", user?.region, user?.age],
    enabled: !!user,
  });

  const { data: finnyAdvice, isLoading: adviceLoading } = useQuery<{ advice: string }>({
    queryKey: ["/api/finny/monthly-advice", selectedMonth],
    enabled: !!user,
  });

  const [year, month] = selectedMonth.split("-").map(Number);

  const monthlyTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === month - 1 && date.getFullYear() === year;
  });

  const totalIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavings = totalIncome - totalExpense;

  const expenseDiffFromRegion = averages
    ? totalExpense - averages.avgExpense
    : 0;

  const expenseDiffFromAge = averages
    ? totalExpense - averages.avgExpense
    : 0;

  const getMonthName = (monthNum: number) => {
    const monthNames: Record<string, string[]> = {
      az: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"],
      en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    };
    return monthNames[language][monthNum - 1];
  };

  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = `${getMonthName(d.getMonth() + 1)} ${d.getFullYear()}`;
      options.push({ value, label });
    }
    return options;
  };

  const expenseByCategory = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomeByCategory = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  if (transactionsLoading || averagesLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="text-report-title">
            <FileText className="w-8 h-8 text-primary" />
            {t.report.title}
          </h1>

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[200px]" data-testid="select-month">
              <SelectValue placeholder={t.report.selectMonth} />
            </SelectTrigger>
            <SelectContent>
              {generateMonthOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card data-testid="report-income-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.report.totalIncome}
                  </p>
                  <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {totalIncome.toLocaleString("az-AZ")} {t.common.azn}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="report-expense-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.report.totalExpense}
                  </p>
                  <p className="text-3xl font-bold text-red-700 dark:text-red-400 tabular-nums">
                    {totalExpense.toLocaleString("az-AZ")} {t.common.azn}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30">
                  <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="report-savings-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.report.totalSavings}
                  </p>
                  <p className={`text-3xl font-bold tabular-nums ${
                    totalSavings >= 0 
                      ? "text-violet-700 dark:text-violet-400" 
                      : "text-red-700 dark:text-red-400"
                  }`}>
                    {totalSavings.toLocaleString("az-AZ")} {t.common.azn}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30">
                  <Wallet className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Cards */}
        {averages && (
          <Card data-testid="report-comparison-card">
            <CardHeader>
              <CardTitle className="text-xl">{t.report.comparison}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{user?.region} {t.report.comparedToRegion}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "az" && `Orta xərc: ${averages.avgExpense.toLocaleString("az-AZ")} AZN`}
                    {language === "en" && `Average expense: ${averages.avgExpense.toLocaleString("az-AZ")} AZN`}
                    {language === "ru" && `Средний расход: ${averages.avgExpense.toLocaleString("az-AZ")} AZN`}
                  </p>
                </div>
                <Badge 
                  variant={expenseDiffFromRegion > 0 ? "destructive" : "default"}
                  className={`gap-1 ${expenseDiffFromRegion <= 0 ? "bg-emerald-500" : ""}`}
                >
                  {expenseDiffFromRegion > 0 ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {Math.abs(expenseDiffFromRegion).toLocaleString("az-AZ")} {t.common.azn}
                  {expenseDiffFromRegion > 0 ? ` ${t.report.moreSpent}` : ` ${t.report.lessSpent}`}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{averages.ageGroup} {t.report.comparedToAge}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "az" && `Orta xərc: ${averages.avgExpense.toLocaleString("az-AZ")} AZN`}
                    {language === "en" && `Average expense: ${averages.avgExpense.toLocaleString("az-AZ")} AZN`}
                    {language === "ru" && `Средний расход: ${averages.avgExpense.toLocaleString("az-AZ")} AZN`}
                  </p>
                </div>
                <Badge 
                  variant={expenseDiffFromAge > 0 ? "destructive" : "default"}
                  className={`gap-1 ${expenseDiffFromAge <= 0 ? "bg-emerald-500" : ""}`}
                >
                  {expenseDiffFromAge > 0 ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {Math.abs(expenseDiffFromAge).toLocaleString("az-AZ")} {t.common.azn}
                  {expenseDiffFromAge > 0 ? ` ${t.report.moreSpent}` : ` ${t.report.lessSpent}`}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                {t.report.totalExpense}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(expenseByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm">
                      {t.categories[category as keyof typeof t.categories]}
                    </span>
                    <span className="font-medium tabular-nums text-red-700 dark:text-red-400">
                      {amount.toLocaleString("az-AZ")} {t.common.azn}
                    </span>
                  </div>
                ))}
              {Object.keys(expenseByCategory).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t.dashboard.noTransactions}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                {t.report.totalIncome}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(incomeByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm">
                      {t.categories[category as keyof typeof t.categories]}
                    </span>
                    <span className="font-medium tabular-nums text-emerald-700 dark:text-emerald-400">
                      {amount.toLocaleString("az-AZ")} {t.common.azn}
                    </span>
                  </div>
                ))}
              {Object.keys(incomeByCategory).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t.dashboard.noTransactions}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Finny Advice */}
        <Card className="bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 border-violet-200 dark:border-violet-800">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="p-2 rounded-full bg-violet-500">
                <Bot className="w-5 h-5 text-white" />
              </div>
              {t.report.finnyAdvice}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {adviceLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {finnyAdvice?.advice || t.finny.getAdvice}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
