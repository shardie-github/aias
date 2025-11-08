import { Resend } from "resend";
import { supabase } from "@/lib/supabase/client";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️  RESEND_API_KEY not set. Email not sent.");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: from || process.env.RESEND_FROM_EMAIL || "Hardonia <noreply@hardonia.com>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email error:", error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error("Email exception:", error);
    return { success: false, error: error.message };
  }
}

export async function sendStreakReminderEmail(userId: string, days: number) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single();

  if (!profile) return { success: false, error: "Profile not found" };

  // Get user email from auth
  const { data: { user } } = await supabase.auth.admin.getUserById(userId);
  if (!user?.email) return { success: false, error: "User email not found" };

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ff6b35; margin: 0;">🔥 ${days} Day Streak!</h1>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <p style="margin: 0 0 15px 0;">Hey ${profile.display_name || "there"},</p>
          
          <p style="margin: 0 0 15px 0;">
            You're on an amazing <strong>${days}-day streak</strong>! 🔥
          </p>
          
          <p style="margin: 0 0 15px 0;">
            Don't let it break! Come back to Hardonia today to keep your streak going and earn more XP.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/play" 
               style="display: inline-block; background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Continue Your Streak →
            </a>
          </div>
        </div>
        
        <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
          Hardonia Team
        </p>
      </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: `🔥 Don't break your ${days}-day streak!`,
    html: emailHtml,
  });
}

export async function sendChallengeNotificationEmail(userId: string, challengeTitle: string, challengeType: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single();

  const { data: { user } } = await supabase.auth.admin.getUserById(userId);
  if (!user?.email) return { success: false, error: "User email not found" };

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6366f1; margin: 0;">🎯 New Challenge Available!</h1>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <p style="margin: 0 0 15px 0;">Hey ${profile?.display_name || "there"},</p>
          
          <p style="margin: 0 0 15px 0;">
            A new <strong>${challengeType}</strong> challenge is starting: <strong>${challengeTitle}</strong>
          </p>
          
          <p style="margin: 0 0 15px 0;">
            Join now to compete with others and earn bonus XP!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/challenges" 
               style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              View Challenge →
            </a>
          </div>
        </div>
        
        <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
          Hardonia Team
        </p>
      </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: `🎯 New Challenge: ${challengeTitle}`,
    html: emailHtml,
  });
}

export async function sendMilestoneEmail(userId: string, milestoneType: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single();

  const { data: { user } } = await supabase.auth.admin.getUserById(userId);
  if (!user?.email) return { success: false, error: "User email not found" };

  const milestoneTitles: Record<string, string> = {
    streak_7: "Week Warrior",
    streak_30: "Month Master",
    streak_100: "Century Streak",
    level_10: "Level 10 Champion",
    level_25: "Level 25 Legend",
    level_50: "Level 50 Elite",
    xp_1000: "1K XP Club",
    xp_10000: "10K XP Master",
    first_badge: "First Badge",
    badge_collector: "Badge Collector",
  };

  const title = milestoneTitles[milestoneType] || "Milestone";

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f59e0b; margin: 0; font-size: 48px;">🏆</h1>
          <h2 style="color: #f59e0b; margin: 10px 0;">Milestone Achieved!</h2>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <p style="margin: 0 0 15px 0;">Congratulations ${profile?.display_name || "there"}!</p>
          
          <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; text-align: center;">
            You've reached: <strong style="color: #f59e0b;">${title}</strong>
          </p>
          
          <p style="margin: 0 0 15px 0;">
            This is an incredible achievement! Keep up the amazing work and continue your journey.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"}/play" 
               style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              View Your Progress →
            </a>
          </div>
        </div>
        
        <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
          Hardonia Team
        </p>
      </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: `🏆 Milestone Achieved: ${title}`,
    html: emailHtml,
  });
}

// Cron job function
export async function checkAndSendStreakReminders() {
  const twentyHoursAgo = new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString();
  
  const { data: streaks } = await supabase
    .from("streaks")
    .select("*, profiles(display_name)")
    .gte("days", 3)
    .lt("updated_at", twentyHoursAgo);

  if (!streaks) return { sent: 0, errors: [] };

  const results = await Promise.allSettled(
    streaks.map((streak) => sendStreakReminderEmail(streak.user_id, streak.days))
  );

  const sent = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
  const errors = results.filter((r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value.success));

  return { sent, errors: errors.length };
}
