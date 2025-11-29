import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bot,
  Send,
  Sparkles,
  Lightbulb,
  TrendingUp,
  PiggyBank,
  AlertCircle,
} from "lucide-react";

interface FinnyAdvice {
  id: string;
  advice: string;
  category: string;
  createdDate: string;
}

const suggestionChips = [
  { icon: TrendingUp, key: "spending" },
  { icon: PiggyBank, key: "savings" },
  { icon: AlertCircle, key: "warnings" },
  { icon: Lightbulb, key: "tips" },
];

export default function Finny() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [question, setQuestion] = useState("");

  const { data: recentAdvice = [], isLoading } = useQuery<FinnyAdvice[]>({
    queryKey: ["/api/finny/recent"],
    enabled: !!user,
  });

  const askMutation = useMutation({
    mutationFn: async (question: string) => {
      return apiRequest("POST", "/api/finny/ask", { question, language });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/finny/recent"] });
      setQuestion("");
    },
  });

  const getSuggestionText = (key: string) => {
    const suggestions: Record<string, Record<string, string>> = {
      spending: {
        az: "Xərclərim haqqında",
        en: "About my spending",
        ru: "О моих расходах",
      },
      savings: {
        az: "Qənaət məsləhətləri",
        en: "Savings tips",
        ru: "Советы по сбережениям",
      },
      warnings: {
        az: "Maliyyə xəbərdarlıqları",
        en: "Financial warnings",
        ru: "Финансовые предупреждения",
      },
      tips: {
        az: "Ümumi məsləhətlər",
        en: "General tips",
        ru: "Общие советы",
      },
    };
    return suggestions[key]?.[language] || suggestions[key]?.en || key;
  };

  const handleSuggestionClick = (key: string) => {
    const text = getSuggestionText(key);
    setQuestion(text);
    askMutation.mutate(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      askMutation.mutate(question.trim());
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === "az" ? "az-AZ" : language === "ru" ? "ru-RU" : "en-US",
      {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 mb-4">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold" data-testid="text-finny-title">
            {t.finny.title}
          </h1>
          <p className="text-muted-foreground mt-2">{t.finny.subtitle}</p>
        </div>

        {/* Chat Interface */}
        <Card className="overflow-hidden" data-testid="finny-chat-card">
          <CardContent className="p-0">
            {/* Messages Area */}
            <ScrollArea className="h-[400px] p-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentAdvice.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="w-16 h-16 text-violet-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t.finny.getAdvice}</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {language === "az" && "Maliyyə vəziyyətiniz haqqında sual verin və şəxsi məsləhətlər alın."}
                    {language === "en" && "Ask questions about your financial situation and get personalized advice."}
                    {language === "ru" && "Задавайте вопросы о вашем финансовом положении и получайте персонализированные советы."}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentAdvice.map((advice) => (
                    <div key={advice.id} className="flex gap-3" data-testid={`advice-${advice.id}`}>
                      <Avatar className="shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                          <Bot className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Finny</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(advice.createdDate)}
                          </span>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 border border-violet-100 dark:border-violet-900">
                          <p className="text-sm leading-relaxed whitespace-pre-line">
                            {advice.advice}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {askMutation.isPending && (
                <div className="flex gap-3 mt-6">
                  <Avatar className="shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 border border-violet-100 dark:border-violet-900">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.4s]" />
                        <span className="ml-2 text-sm text-muted-foreground">
                          {t.finny.thinking}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Suggestion Chips */}
            <div className="px-4 py-3 border-t border-border bg-muted/30">
              <div className="flex flex-wrap gap-2">
                {suggestionChips.map(({ icon: Icon, key }) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs"
                    onClick={() => handleSuggestionClick(key)}
                    disabled={askMutation.isPending}
                    data-testid={`button-suggestion-${key}`}
                  >
                    <Icon className="w-3 h-3" />
                    {getSuggestionText(key)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={t.finny.placeholder}
                  disabled={askMutation.isPending}
                  className="flex-1"
                  data-testid="input-finny-question"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!question.trim() || askMutation.isPending}
                  data-testid="button-send-question"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Recent Advice Section */}
        {recentAdvice.length > 0 && (
          <Card data-testid="recent-advice-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                {t.finny.recentAdvice}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAdvice.slice(0, 3).map((advice) => (
                <div 
                  key={advice.id}
                  className="p-3 rounded-lg border bg-card"
                >
                  <p className="text-sm line-clamp-2">{advice.advice}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDate(advice.createdDate)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
