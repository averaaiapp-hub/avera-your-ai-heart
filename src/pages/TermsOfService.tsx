import { useEffect } from "react";

const TermsOfService = () => {
  useEffect(() => {
    document.title = "Terms of Service | Avera";
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-10">
          <p className="text-sm text-muted-foreground mb-2">Last updated: {new Date().getFullYear()}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Avera Terms of Service</h1>
          <p className="text-muted-foreground">
            These Terms of Service ("Terms") govern your access to and use of Avera, an AI companion
            application that offers chat, voice, and subscription-based features. By creating an account or
            using Avera, you agree to be bound by these Terms.
          </p>
        </header>

        <section className="space-y-8 text-sm leading-relaxed md:text-base">
          <article className="space-y-3">
            <h2 className="text-xl font-semibold">1. What Avera provides</h2>
            <p>
              Avera is an AI-powered companion that offers emotional support, conversation, and entertainment
              through text and voice. Your companion is entirely artificial intelligence, not a human being.
            </p>
            <p>
              The app includes onboarding to configure your companion&apos;s personality, ongoing chat,
              emotional modes, voice messaging, virtual gifts, and premium features available through
              subscriptions after a limited free trial.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use Avera. By using the app, you confirm that you are legally
              permitted to enter into these Terms in your place of residence.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">3. Your account</h2>
            <p>
              To use Avera, you need to create an account with a valid email address and secure password. You
              are responsible for maintaining the confidentiality of your login credentials and for all activity
              that occurs under your account.
            </p>
            <p>
              If you believe your account has been compromised, you should reset your password and contact us as
              soon as possible.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">4. Acceptable use</h2>
            <p>You agree not to use Avera to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Engage in illegal activities or encourage others to do so.</li>
              <li>Harass, abuse, or harm yourself or others.</li>
              <li>Generate or share unlawful, hateful, or extremely violent content.</li>
              <li>Attempt to reverse engineer, interfere with, or disrupt the service.</li>
              <li>Bypass technical or security protections in the app or backend.</li>
            </ul>
            <p>
              We may suspend or terminate your access if we believe you are misusing the service or violating
              these Terms.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">5. Subscriptions, payments, and free trial</h2>
            <p>
              Avera offers a limited free trial with a small number of free messages so you can get to know your
              companion. After your trial is over, continued use of premium features (such as unlimited
              messaging, ongoing voice replies, gifts, and advanced memory) requires an active paid
              subscription.
            </p>
            <p>
              Subscription pricing and billing period (for example, weekly or monthly) may vary by country. In
              some regions we use Razorpay (especially in India), while in others we may use Stripe or similar
              payment providers. All payments are processed securely by these third-party processors, and their
              terms may also apply.
            </p>
            <p>
              Subscriptions renew automatically at the end of each billing period unless you cancel before the
              renewal date. You can manage or cancel your subscription through the app or by contacting support.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">6. Refunds and cancellations</h2>
            <p>
              Because Avera is a digital, subscription-based service, charges are generally non-refundable once a
              billing period has started, except where required by applicable law or as described in our Refund
              and Cancellation Policy.
            </p>
            <p>
              If you cancel, you will typically retain access to premium features until the end of your current
              billing period, and you will not be billed again unless you restart your subscription.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">7. No medical or professional advice</h2>
            <p>
              Avera is designed for companionship and emotional support, not as a substitute for therapy,
              counseling, medical treatment, or crisis intervention. The AI may generate responses that feel
              empathetic or advisory, but it does not provide professional advice.
            </p>
            <p>
              If you are in crisis or need professional help, please contact local emergency services or a
              qualified mental health professional in your area.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">8. Intellectual property</h2>
            <p>
              We and our licensors retain all rights, title, and interest in and to Avera, including the
              software, branding, visuals, and AI systems. You are granted a limited, non-exclusive,
              non-transferable license to use the app for personal, non-commercial purposes in accordance with
              these Terms.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">9. Service changes and termination</h2>
            <p>
              We may update, modify, or discontinue parts of Avera from time to time in order to improve the
              experience or for technical, security, or business reasons. If we make material changes that
              significantly impact your use of the service, we will try to provide reasonable notice where
              practical.
            </p>
            <p>
              We may suspend or terminate your access if you violate these Terms, misuse the service, or where
              required by law. You may stop using Avera and delete your account at any time.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">10. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, Avera and its operators will not be liable for any
              indirect, incidental, consequential, special, or punitive damages, or any loss of data, profits,
              or reputation, arising from your use of or inability to use the service.
            </p>
            <p>
              Nothing in these Terms is intended to limit any non-waivable rights you may have under applicable
              consumer protection laws in your country of residence.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">11. Changes to these Terms</h2>
            <p>
              We may update these Terms from time to time. When we do, we will update the &quot;Last
              updated&quot; date above and, where appropriate, notify you in the app. Your continued use of
              Avera after changes become effective means you accept the updated Terms.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">12. Contact</h2>
            <p>
              If you have questions about these Terms or how they apply to you, you can contact us at:
            </p>
            <p className="font-medium">support@avera.app</p>
          </article>
        </section>
      </section>
    </main>
  );
};

export default TermsOfService;
