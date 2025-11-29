import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { GoalsMini } from "@/components/dashboard/GoalsMini";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction, Goal } from "@shared/schema";

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: !!user,
  });

  const { data: goals = [], isLoading: goalsLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
    enabled: !!user,
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/transactions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
  });

  const editTransactionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest("PUT", `/api/transactions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlySavings = monthlyIncome - monthlyExpense;

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (transactionsLoading || goalsLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">
          {t.dashboard.title}
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title={t.dashboard.thisMonthIncome}
            amount={monthlyIncome}
            type="income"
          />
          <StatCard
            title={t.dashboard.thisMonthExpense}
            amount={monthlyExpense}
            type="expense"
          />
          <StatCard
            title={t.dashboard.savings}
            amount={monthlySavings}
            type="savings"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionTable
              transactions={sortedTransactions}
              onAdd={(data) => addTransactionMutation.mutate(data)}
              onEdit={(id, data) => editTransactionMutation.mutate({ id, data })}
              onDelete={(id) => deleteTransactionMutation.mutate(id)}
              isLoading={
                addTransactionMutation.isPending ||
                editTransactionMutation.isPending ||
                deleteTransactionMutation.isPending
              }
            />
          </div>
          <div>
            <GoalsMini goals={goals} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
