import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { regions } from "@shared/schema";

type Step = "login" | "complete-profile";

interface ProfileData {
  fullName: string;
  age: number;
  region: string;
  gender?: string;
}

export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    age: 18,
    region: "",
    gender: undefined,
  });

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/google/init");
      const data = await response.json();
      
      if (data.requiresProfile) {
        setGoogleEmail(data.email);
        setProfileData(prev => ({ ...prev, fullName: data.name || "" }));
        setStep("complete-profile");
      } else if (data.user) {
        login(data.user);
        setLocation("/");
      }
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!profileData.fullName || !profileData.region || !profileData.age) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: googleEmail,
          ...profileData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.user);
        setLocation("/");
      }
    } catch (error) {
      console.error("Profile completion failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const genderOptions = [
    { value: "male", label: t.profile.male },
    { value: "female", label: t.profile.female },
    { value: "other", label: t.profile.other },
    { value: "prefer_not_to_say", label: t.profile.prefer_not_to_say },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-violet-50 dark:to-violet-950/20 flex items-center justify-center p-4">
      <LanguageSwitcher />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-violet-500 mb-4">
            <span className="text-white font-bold text-4xl">F</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">FinEdu AZ</h1>
          <p className="text-muted-foreground mt-2">{t.auth.subtitle}</p>
        </div>

        {step === "login" && (
          <Card data-testid="login-card">
            <CardHeader className="text-center">
              <CardTitle>{t.auth.welcome}</CardTitle>
              <CardDescription>{t.auth.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full gap-3 h-12"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                data-testid="button-google-login"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <SiGoogle className="w-5 h-5" />
                )}
                {t.auth.loginWithGoogle}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "complete-profile" && (
          <Card data-testid="complete-profile-card">
            <CardHeader>
              <CardTitle>{t.auth.completeProfile}</CardTitle>
              <CardDescription>{googleEmail}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t.auth.fullName}</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                  data-testid="input-full-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">{t.auth.age}</Label>
                <Input
                  id="age"
                  type="number"
                  min={14}
                  max={100}
                  value={profileData.age}
                  onChange={(e) => setProfileData(prev => ({ ...prev, age: parseInt(e.target.value) || 14 }))}
                  data-testid="input-age"
                />
              </div>

              <div className="space-y-2">
                <Label>{t.auth.region}</Label>
                <Select
                  value={profileData.region}
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, region: value }))}
                >
                  <SelectTrigger data-testid="select-region">
                    <SelectValue placeholder={t.auth.region} />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t.auth.gender}</Label>
                <Select
                  value={profileData.gender}
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger data-testid="select-gender">
                    <SelectValue placeholder={t.auth.gender} />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full mt-6"
                onClick={handleCompleteProfile}
                disabled={isLoading || !profileData.fullName || !profileData.region}
                data-testid="button-complete-profile"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {t.auth.continue}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
