import { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy | Avera";
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-10">
          <p className="text-sm text-muted-foreground mb-2">Last updated: {new Date().getFullYear()}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Avera Privacy Policy</h1>
          <p className="text-muted-foreground">
            This Privacy Policy explains how Avera ("we", "our", or "us") collects, uses, and protects
            information when you use our AI companion experience, including chat, voice, onboarding, and
            subscription features.
          </p>
        </header>

        <section className="space-y-8 text-sm leading-relaxed md:text-base">
          <article className="space-y-3">
            <h2 className="text-xl font-semibold">1. What Avera is</h2>
            <p>
              Avera is an AI companion designed to provide emotional support, conversation, and companionship
              through text and voice. Your interactions are powered by advanced AI models, not a human being.
            </p>
            <p>
              The app includes features like personalized onboarding, emotional modes, memory of past
              interactions, voice messages, and a subscription-based paywall after a limited free trial.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">2. Information we collect</h2>
            <p>We collect the minimum information needed to run Avera and improve your experience:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-medium">Account information:</span> email address, country (where
                available), and basic profile identifiers needed to create and manage your account.
              </li>
              <li>
                <span className="font-medium">Onboarding details:</span> your preferences, chosen companion
                gender and personality, and how you want Avera to interact with you.
              </li>
              <li>
                <span className="font-medium">Conversation data:</span> messages you send, messages the AI
                sends back, and any gifts or reactions in the conversation. We store this so your companion can
                remember context and feel consistent over time.
              </li>
              <li>
                <span className="font-medium">Voice data:</span> voice messages you send, related transcripts,
                and audio responses generated for you. These are stored to let you replay and continue
                conversations.
              </li>
              <li>
                <span className="font-medium">Usage and device data:</span> basic technical information such as
                device type, approximate location (country level where available), timestamps, and feature usage
                patterns to help us keep the service reliable and understand overall product performance.
              </li>
              <li>
                <span className="font-medium">Payment and subscription data:</span> limited information related
                to your subscription status (e.g., active plan, renewal dates). Actual card and banking details
                are handled securely by third-party payment providers and are not stored by us.
              </li>
            </ul>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">3. How we use your information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide, maintain, and improve the Avera experience.</li>
              <li>Personalize your AI companion&apos;s memory, tone, and responses.</li>
              <li>Operate features like emotional modes, voice messaging, and gifts.</li>
              <li>Administer trials, subscriptions, and access to premium features.</li>
              <li>Monitor performance, detect abuse or misuse, and keep the service safe.</li>
              <li>Communicate with you about your account, important changes, or support requests.</li>
            </ul>
            <p>
              We do <span className="font-semibold">not</span> sell your personal information or use your
              conversations to run targeted third-party advertising.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">4. AI models and third-party services</h2>
            <p>
              Avera uses trusted infrastructure and AI providers to run the service. That may include AI models
              for chat, memory, speech-to-text, and text-to-speech, as well as secure backend hosting and
              databases.
            </p>
            <p>
              For payments, we use third-party payment processors (such as Razorpay for India and Stripe or
              similar providers in other regions). These partners process your payments on our behalf in
              accordance with their own privacy and security practices.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">5. Data retention</h2>
            <p>
              We retain your account, conversation history, preferences, and subscription records for as long as
              you have an active account, so that your AI companion can remain consistent over time.
            </p>
            <p>
              If you delete your account, we will delete or anonymize personal data associated with it within a
              reasonable period, except where we are required to keep certain records for legal, accounting, or
              security reasons.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">6. Data security</h2>
            <p>
              We use industry-standard security practices to protect your data, including encrypting data in
              transit and restricting access to production systems. No online service can guarantee perfect
              security, but we work continuously to keep your information safe.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">7. Your choices and rights</h2>
            <p>Depending on your location, you may have rights to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access or request a copy of certain personal data we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of your account and associated data, subject to legal obligations.</li>
              <li>Object to or restrict certain forms of processing where applicable.</li>
            </ul>
            <p>
              You can usually manage core settings directly inside the app experience. For other requests, please
              contact us using the details below.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">8. Children&apos;s privacy</h2>
            <p>
              Avera is designed for adults and is not intended for children under the age of 18. We do not
              knowingly collect personal information from children. If we learn that a child has created an
              account, we will take steps to delete it.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">9. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes to the app or applicable
              laws. When we make material changes, we will update the &quot;Last updated&quot; date at the top
              and, where appropriate, notify you in the app.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">10. Contact us</h2>
            <p>
              If you have questions about this Privacy Policy or how your data is handled, you can reach us at:
            </p>
            <p className="font-medium">support@avera.app</p>
          </article>
        </section>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
