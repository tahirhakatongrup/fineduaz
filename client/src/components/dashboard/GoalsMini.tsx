import { Link } from "wouter";
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, ChevronRight, Sparkles } from "lucide-react";
import type { Goal } from "@shared/schema";

interface GoalsMiniProps {
  goals: Goal[];
}

export function GoalsMini({ goals }: GoalsMiniProps) {
  const { t } = useLanguage();

  const getProgress = (goal: Goal) => {
    return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  };

  return (
    <Card data-testid="goals-mini-card">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-violet-500" />
          {t.dashboard.yourGoals}
        </CardTitle>
        <Link href="/goals">
          <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-all-goals">
            {t.dashboard.viewAll}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{t.goals.noGoals}</p>
            <Link href="/goals">
              <Button variant="outline" size="sm" className="mt-4" data-testid="button-create-first-goal">
                {t.goals.createGoal}
              </Button>
            </Link>
          </div>
        ) : (
          goals.slice(0, 3).map((goal) => {
            const progress = getProgress(goal);
            return (
              <div 
                key={goal.id} 
                className="space-y-2"
                data-testid={`goal-mini-${goal.id}`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate max-w-[60%]">{goal.name}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {goal.currentAmount.toLocaleString("az-AZ")} / {goal.targetAmount.toLocaleString("az-AZ")} {t.common.azn}
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                  <span className="absolute right-0 -top-5 text-xs font-semibold text-violet-600 dark:text-violet-400">
                    {progress}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
