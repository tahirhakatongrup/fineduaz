import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface StatCardProps {
  title: string;
  amount: number;
  type: "income" | "expense" | "savings";
  trend?: number;
}

export function StatCard({ title, amount, type, trend }: StatCardProps) {
  const { t } = useLanguage();

  const getIcon = () => {
    switch (type) {
      case "income":
        return <TrendingUp className="w-5 h-5" />;
      case "expense":
        return <TrendingDown className="w-5 h-5" />;
      case "savings":
        return <Wallet className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "income":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/30",
          icon: "text-emerald-600 dark:text-emerald-400",
          amount: "text-emerald-700 dark:text-emerald-300",
        };
      case "expense":
        return {
          bg: "bg-red-50 dark:bg-red-950/30",
          icon: "text-red-600 dark:text-red-400",
          amount: "text-red-700 dark:text-red-300",
        };
      case "savings":
        return {
          bg: "bg-violet-50 dark:bg-violet-950/30",
          icon: "text-violet-600 dark:text-violet-400",
          amount: "text-violet-700 dark:text-violet-300",
        };
    }
  };

  const colors = getColors();

  return (
    <Card className="overflow-hidden" data-testid={`stat-card-${type}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold tabular-nums ${colors.amount}`}>
                {amount.toLocaleString("az-AZ")}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {t.common.azn}
              </span>
            </div>
            {trend !== undefined && (
              <p className={`text-xs ${trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {trend >= 0 ? "+" : ""}{trend}% {t.report.comparedToRegion}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colors.bg}`}>
            <div className={colors.icon}>{getIcon()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
