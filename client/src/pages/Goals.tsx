import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Plus, 
  Target, 
  Sparkles,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import type { Goal } from "@shared/schema";

const goalFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  targetAmount: z.coerce.number().positive("Target must be positive"),
  deadline: z.string().optional(),
});

const addSavingsSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
});

type GoalFormData = z.infer<typeof goalFormSchema>;
type AddSavingsData = z.infer<typeof addSavingsSchema>;

export default function Goals() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [addSavingsGoalId, setAddSavingsGoalId] = useState<string | null>(null);

  const { data: goals = [], isLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
    enabled: !!user,
  });

  const createGoalMutation = useMutation({
    mutationFn: async (data: GoalFormData) => {
      return apiRequest("POST", "/api/goals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      setCreateDialogOpen(false);
    },
  });

  const addSavingsMutation = useMutation({
    mutationFn: async ({ goalId, amount }: { goalId: string; amount: number }) => {
      return apiRequest("POST", `/api/goals/${goalId}/add-savings`, { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      setAddSavingsGoalId(null);
    },
  });

  const createForm = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: "",
      targetAmount: 0,
      deadline: "",
    },
  });

  const savingsForm = useForm<AddSavingsData>({
    resolver: zodResolver(addSavingsSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const getProgress = (goal: Goal) => {
    return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  };

  const handleCreateGoal = (data: GoalFormData) => {
    createGoalMutation.mutate(data);
  };

  const handleAddSavings = (data: AddSavingsData) => {
    if (addSavingsGoalId) {
      addSavingsMutation.mutate({ goalId: addSavingsGoalId, amount: data.amount });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="text-goals-title">
            <Target className="w-8 h-8 text-violet-500" />
            {t.goals.title}
          </h1>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-create-goal">
                <Plus className="w-4 h-4" />
                {t.goals.createGoal}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.goals.createGoal}</DialogTitle>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleCreateGoal)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.goals.goalName}</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-goal-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="targetAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.goals.targetAmount} ({t.common.azn})</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0} 
                            step="0.01"
                            {...field} 
                            data-testid="input-goal-target" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.goals.deadline}</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            data-testid="input-goal-deadline" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCreateDialogOpen(false)}
                    >
                      {t.goals.cancel}
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createGoalMutation.isPending}
                      data-testid="button-submit-goal"
                    >
                      {t.goals.create}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {goals.length === 0 ? (
          <Card className="py-16">
            <CardContent className="text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-violet-400 opacity-50" />
              <p className="text-lg text-muted-foreground mb-4">{t.goals.noGoals}</p>
              <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                {t.goals.createGoal}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => {
              const progress = getProgress(goal);
              const isCompleted = progress >= 100;
              return (
                <Card 
                  key={goal.id} 
                  className={`overflow-hidden ${isCompleted ? "ring-2 ring-emerald-500" : ""}`}
                  data-testid={`goal-card-${goal.id}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">{goal.name}</CardTitle>
                      {isCompleted && (
                        <Badge className="bg-emerald-500 shrink-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {t.goals.completed}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t.goals.progress}</span>
                        <span className="font-semibold text-violet-600 dark:text-violet-400">
                          {progress}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          {goal.currentAmount.toLocaleString("az-AZ")} / {goal.targetAmount.toLocaleString("az-AZ")} {t.common.azn}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t.goals.remaining}: {(goal.targetAmount - goal.currentAmount).toLocaleString("az-AZ")} {t.common.azn}
                        </p>
                      </div>
                    </div>

                    {!isCompleted && (
                      <Dialog 
                        open={addSavingsGoalId === goal.id} 
                        onOpenChange={(open) => !open && setAddSavingsGoalId(null)}
                      >
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full gap-2"
                            onClick={() => setAddSavingsGoalId(goal.id)}
                            data-testid={`button-add-savings-${goal.id}`}
                          >
                            <Wallet className="w-4 h-4" />
                            {t.goals.addSavings}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t.goals.addSavings}</DialogTitle>
                          </DialogHeader>
                          <Form {...savingsForm}>
                            <form onSubmit={savingsForm.handleSubmit(handleAddSavings)} className="space-y-4">
                              <FormField
                                control={savingsForm.control}
                                name="amount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t.dashboard.amount} ({t.common.azn})</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min={0} 
                                        step="0.01"
                                        {...field}
                                        data-testid="input-savings-amount"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex justify-end gap-2 pt-4">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => setAddSavingsGoalId(null)}
                                >
                                  {t.common.cancel}
                                </Button>
                                <Button 
                                  type="submit"
                                  disabled={addSavingsMutation.isPending}
                                  data-testid="button-submit-savings"
                                >
                                  {t.common.add}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
