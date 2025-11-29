import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Globe,
  Pencil,
  X,
  Check,
} from "lucide-react";
import { regions } from "@shared/schema";
import type { Language } from "@/lib/translations";

const profileSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  age: z.coerce.number().min(14).max(100),
  region: z.string().min(1, "Region is required"),
  gender: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { t, language, setLanguage } = useLanguage();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      age: user?.age || 18,
      region: user?.region || "",
      gender: user?.gender || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return apiRequest("PUT", "/api/users/profile", data);
    },
    onSuccess: (data: any) => {
      updateUser(data.user);
      setIsEditing(false);
    },
  });

  const handleSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === "az" ? "az-AZ" : language === "ru" ? "ru-RU" : "en-US",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const genderOptions = [
    { value: "male", label: t.profile.male },
    { value: "female", label: t.profile.female },
    { value: "other", label: t.profile.other },
    { value: "prefer_not_to_say", label: t.profile.prefer_not_to_say },
  ];

  const languages: { value: Language; label: string }[] = [
    { value: "az", label: "Azərbaycan" },
    { value: "en", label: "English" },
    { value: "ru", label: "Русский" },
  ];

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t.common.loading}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="text-profile-title">
          <User className="w-8 h-8 text-primary" />
          {t.profile.title}
        </h1>

        <Card data-testid="profile-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-violet-500 text-white text-2xl">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{user.fullName}</h2>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                </div>
              </div>
              {!isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => setIsEditing(true)}
                  data-testid="button-edit-profile"
                >
                  <Pencil className="w-4 h-4" />
                  {t.profile.edit}
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.profile.fullName}</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-edit-fullname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.profile.age}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={14} 
                            max={100} 
                            {...field} 
                            data-testid="input-edit-age"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.profile.region}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-edit-region">
                              <SelectValue placeholder={t.profile.region} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region}
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
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.profile.gender}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-edit-gender">
                              <SelectValue placeholder={t.profile.gender} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {genderOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        form.reset();
                      }}
                      className="gap-2"
                      data-testid="button-cancel-edit"
                    >
                      <X className="w-4 h-4" />
                      {t.profile.cancel}
                    </Button>
                    <Button 
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="gap-2"
                      data-testid="button-save-profile"
                    >
                      <Check className="w-4 h-4" />
                      {t.profile.save}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t.profile.age}</p>
                    <p className="font-medium">{user.age}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {t.profile.region}
                    </p>
                    <p className="font-medium">{user.region}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t.profile.gender}</p>
                    <p className="font-medium">
                      {user.gender ? t.profile[user.gender as keyof typeof t.profile] : "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {t.profile.registrationDate}
                    </p>
                    <p className="font-medium">{formatDate(user.registrationDate)}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card data-testid="settings-card">
          <CardHeader>
            <CardTitle className="text-lg">{t.profile.settings}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t.profile.language}</p>
                    <p className="text-sm text-muted-foreground">
                      {languages.find((l) => l.value === language)?.label}
                    </p>
                  </div>
                </div>
                <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                  <SelectTrigger className="w-[140px]" data-testid="select-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
