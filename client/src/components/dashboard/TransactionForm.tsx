import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Transaction } from "@shared/schema";

const incomeCategories = ["salary", "freelance", "investment", "gift", "other_income"] as const;
const expenseCategories = ["food", "transport", "entertainment", "utilities", "shopping", "health", "education", "other"] as const;

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TransactionFormProps {
  type: "income" | "expense";
  defaultValues?: Partial<Transaction>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export function TransactionForm({ type, defaultValues, onSubmit, onCancel }: TransactionFormProps) {
  const { t } = useLanguage();

  const categories = type === "income" ? incomeCategories : expenseCategories;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: defaultValues?.date || new Date().toISOString().split("T")[0],
      category: defaultValues?.category || "",
      amount: defaultValues?.amount || 0,
      description: defaultValues?.description || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.dashboard.date}</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  data-testid="input-transaction-date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.dashboard.category}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-transaction-category">
                    <SelectValue placeholder={t.dashboard.category} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t.categories[cat as keyof typeof t.categories]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.dashboard.amount} ({t.common.azn})</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  min="0"
                  {...field}
                  data-testid="input-transaction-amount"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.common.description}</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder=""
                  className="resize-none"
                  data-testid="input-transaction-description"
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
            onClick={onCancel}
            data-testid="button-cancel-transaction"
          >
            {t.common.cancel}
          </Button>
          <Button 
            type="submit"
            data-testid="button-submit-transaction"
          >
            {t.common.save}
          </Button>
        </div>
      </form>
    </Form>
  );
}
