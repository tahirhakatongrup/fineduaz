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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
  Trophy,
  UserPlus,
  Users,
  Medal,
  Check,
  X,
  Mail,
} from "lucide-react";

interface Friend {
  id: string;
  username: string;
  goalName: string;
  goalProgress: number;
}

interface FriendRequest {
  id: string;
  fromUsername: string;
  fromEmail: string;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  goalName: string;
  completion: number;
}

const addFriendSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type AddFriendData = z.infer<typeof addFriendSchema>;

export default function Race() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false);

  const { data: friends = [], isLoading: friendsLoading } = useQuery<Friend[]>({
    queryKey: ["/api/friends"],
    enabled: !!user,
  });

  const { data: pendingRequests = [], isLoading: requestsLoading } = useQuery<FriendRequest[]>({
    queryKey: ["/api/friends/requests"],
    enabled: !!user,
  });

  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/friends/leaderboard"],
    enabled: !!user,
  });

  const addFriendMutation = useMutation({
    mutationFn: async (data: AddFriendData) => {
      return apiRequest("POST", "/api/friends/request", data);
    },
    onSuccess: () => {
      setAddFriendDialogOpen(false);
      form.reset();
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      return apiRequest("POST", `/api/friends/accept/${requestId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/friends/leaderboard"] });
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      return apiRequest("POST", `/api/friends/reject/${requestId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/friends/requests"] });
    },
  });

  const form = useForm<AddFriendData>({
    resolver: zodResolver(addFriendSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleAddFriend = (data: AddFriendData) => {
    addFriendMutation.mutate(data);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-600";
      default:
        return "text-muted-foreground";
    }
  };

  if (friendsLoading || requestsLoading || leaderboardLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="text-race-title">
            <Trophy className="w-8 h-8 text-yellow-500" />
            {t.race.title}
          </h1>

          <Dialog open={addFriendDialogOpen} onOpenChange={setAddFriendDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-friend">
                <UserPlus className="w-4 h-4" />
                {t.race.addFriend}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.race.addFriend}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddFriend)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.race.friendEmail}</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="friend@gmail.com"
                            {...field}
                            data-testid="input-friend-email"
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
                      onClick={() => setAddFriendDialogOpen(false)}
                    >
                      {t.common.cancel}
                    </Button>
                    <Button 
                      type="submit"
                      disabled={addFriendMutation.isPending}
                      data-testid="button-send-request"
                    >
                      {t.race.sendRequest}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Friend Requests */}
          {pendingRequests.length > 0 && (
            <Card className="lg:col-span-2" data-testid="pending-requests-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  {t.race.pendingRequests}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingRequests.map((request) => (
                  <div 
                    key={request.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    data-testid={`request-${request.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(request.fromUsername)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.fromUsername}</p>
                        <p className="text-sm text-muted-foreground">{request.fromEmail}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                        onClick={() => acceptRequestMutation.mutate(request.id)}
                        disabled={acceptRequestMutation.isPending}
                        data-testid={`button-accept-${request.id}`}
                      >
                        <Check className="w-4 h-4" />
                        {t.race.accept}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => rejectRequestMutation.mutate(request.id)}
                        disabled={rejectRequestMutation.isPending}
                        data-testid={`button-reject-${request.id}`}
                      >
                        <X className="w-4 h-4" />
                        {t.race.reject}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Leaderboard */}
          <Card data-testid="leaderboard-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                {t.race.leaderboard}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{t.race.noFriends}</p>
                </div>
              ) : (
                leaderboard.map((entry) => (
                  <div 
                    key={entry.rank}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                    data-testid={`leaderboard-entry-${entry.rank}`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-background ${getMedalColor(entry.rank)}`}>
                      {entry.rank <= 3 ? (
                        <Medal className="w-5 h-5" />
                      ) : (
                        <span className="font-bold text-sm">{entry.rank}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">{entry.username}</p>
                        <Badge variant="secondary" className="shrink-0">
                          {entry.completion}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {entry.goalName}
                      </p>
                      <Progress value={entry.completion} className="h-2" />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Friends List */}
          <Card data-testid="friends-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {t.race.thisMonth}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {friends.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{t.race.noFriends}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setAddFriendDialogOpen(true)}
                  >
                    {t.race.addFriend}
                  </Button>
                </div>
              ) : (
                friends.map((friend) => (
                  <div 
                    key={friend.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                    data-testid={`friend-${friend.id}`}
                  >
                    <Avatar>
                      <AvatarFallback className="bg-violet-500 text-white">
                        {getInitials(friend.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{friend.username}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {friend.goalName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-violet-600 dark:text-violet-400">
                        {friend.goalProgress}%
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
