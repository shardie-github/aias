import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Gift, Users, Share2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Referral Program — AIAS Platform | Get 1 Month Free",
  description: "Refer friends and get 1 month free for both of you. Share AIAS Platform and help others save 10+ hours/week with AI automation.",
};

export default function ReferralPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          🎁 Referral Program • Get 1 Month Free
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Refer Friends, Get Rewarded
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Share AIAS Platform with friends and colleagues. When they sign up, you both get <strong>1 month free</strong>. 
          Help others save 10+ hours/week with AI automation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Share2 className="h-6 w-6 text-primary" />
              <CardTitle>Share Your Link</CardTitle>
            </div>
            <CardDescription>
              Get your unique referral link and share it with friends, colleagues, or on social media.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="referral-link">Your Referral Link</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="referral-link"
                    value="https://aias-platform.com/signup?ref=YOUR_CODE"
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Share on Twitter
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Share on LinkedIn
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle>They Sign Up</CardTitle>
            </div>
            <CardDescription>
              When someone signs up using your referral link, they get 1 month free on any paid plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">They start with 14-day free trial</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">When they upgrade, they get 1 month free</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">No credit card required for trial</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Gift className="h-6 w-6 text-primary" />
              <CardTitle>You Get Rewarded</CardTitle>
            </div>
            <CardDescription>
              When your referral upgrades to a paid plan, you get 1 month free added to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">1 month free for each successful referral</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Unlimited referrals</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">Rewards applied automatically</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Get Your Referral Link</h4>
                <p className="text-sm text-muted-foreground">
                  Sign in to your account and copy your unique referral link from your dashboard.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Share with Friends</h4>
                <p className="text-sm text-muted-foreground">
                  Share your referral link via email, social media, or word of mouth. 
                  Anyone who signs up using your link is your referral.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">They Sign Up</h4>
                <p className="text-sm text-muted-foreground">
                  Your referral starts with a 14-day free trial. No credit card required.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">Both Get Rewarded</h4>
                <p className="text-sm text-muted-foreground">
                  When your referral upgrades to a paid plan (Starter or Pro), they get 1 month free, 
                  and you get 1 month free added to your account automatically.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Referrals</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Months Free</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Sign in to see your referral stats and get your referral link.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-12 space-y-4">
        <h2 className="text-2xl font-bold">Ready to Start Referring?</h2>
        <p className="text-muted-foreground">
          Sign in to get your referral link and start earning free months.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <a href="/signup">Sign Up to Get Started</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="/signin">Sign In</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
