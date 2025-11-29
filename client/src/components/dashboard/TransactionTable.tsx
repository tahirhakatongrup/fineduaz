import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Pencil, 
  Trash2,
  Utensils,
  Car,
  Gamepad2,
  Zap,
  ShoppingBag,
  Heart,
  GraduationCap,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Coins,
} from "lucide-react";
import type { Transaction } from "@shared/schema";
import { TransactionForm } from "./TransactionForm";

const categoryIcons: Record<string, any> = {
  food: Utensils,
  transport: Car,
  entertainment: Gamepad2,
  utilities: Zap,
  shopping: ShoppingBag,
  health: Heart,
  education: GraduationCap,
  other: MoreHorizontal,
  salary: Briefcase,
  freelance: Laptop,
  investment: TrendingUp,
  gift: Gift,
  other_income: Coins,
};

interface TransactionTableProps {
  transactions: Transaction[];
  onAdd: (data: any) => void;
  onEdit: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function TransactionTable({
  transactions,
  onAdd,
  onEdit,
  onDelete,
  isLoading,
}: TransactionTableProps) {
  const { t } = useLanguage();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addType, setAddType] = useState<"income" | "expense">("expense");
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAddSubmit = (data: any) => {
    onAdd({ ...data, type: addType });
    setAddDialogOpen(false);
  };

  const handleEditSubmit = (data: any) => {
    if (editTransaction) {
      onEdit(editTransaction.id, data);
      setEditTransaction(null);
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("az-AZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card data-testid="transaction-table-card">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">
          {t.dashboard.transactions}
        </CardTitle>
        <div className="flex gap-2">
          <Dialog open={addDialogOpen && addType === "income"} onOpenChange={(open) => {
            if (open) setAddType("income");
            setAddDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950"
                data-testid="button-add-income"
              >
                <Plus className="w-4 h-4" />
                {t.dashboard.addIncome}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.dashboard.addIncome}</DialogTitle>
              </DialogHeader>
              <TransactionForm 
                type="income"
                onSubmit={handleAddSubmit}
                onCancel={() => setAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={addDialogOpen && addType === "expense"} onOpenChange={(open) => {
            if (open) setAddType("expense");
            setAddDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                data-testid="button-add-expense"
              >
                <Plus className="w-4 h-4" />
                {t.dashboard.addExpense}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.dashboard.addExpense}</DialogTitle>
              </DialogHeader>
              <TransactionForm 
                type="expense"
                onSubmit={handleAddSubmit}
                onCancel={() => setAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground" data-testid="text-no-transactions">
            <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{t.dashboard.noTransactions}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.dashboard.date}</TableHead>
                  <TableHead>{t.dashboard.category}</TableHead>
                  <TableHead>{t.dashboard.amount}</TableHead>
                  <TableHead>{t.dashboard.type}</TableHead>
                  <TableHead className="text-right">{t.dashboard.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const Icon = categoryIcons[transaction.category] || MoreHorizontal;
                  const categoryKey = transaction.category as keyof typeof t.categories;
                  return (
                    <TableRow 
                      key={transaction.id}
                      data-testid={`transaction-row-${transaction.id}`}
                    >
                      <TableCell className="font-medium">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md ${
                            transaction.type === "income" 
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400" 
                              : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span>{t.categories[categoryKey]}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`font-semibold tabular-nums ${
                        transaction.type === "income" 
                          ? "text-emerald-700 dark:text-emerald-400" 
                          : "text-red-700 dark:text-red-400"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}
                        {transaction.amount.toLocaleString("az-AZ")} {t.common.azn}
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === "income" ? "default" : "destructive"}>
                          {transaction.type === "income" ? t.dashboard.income : t.dashboard.expense}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditTransaction(transaction)}
                            data-testid={`button-edit-${transaction.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(transaction.id)}
                            data-testid={`button-delete-${transaction.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={!!editTransaction} onOpenChange={(open) => !open && setEditTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.dashboard.edit}</DialogTitle>
          </DialogHeader>
          {editTransaction && (
            <TransactionForm
              type={editTransaction.type}
              defaultValues={editTransaction}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditTransaction(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.common.confirm}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.common.delete}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
