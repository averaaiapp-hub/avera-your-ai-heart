import { useEffect } from "react";

const RefundCancellationPolicy = () => {
  useEffect(() => {
    document.title = "Refund & Cancellation Policy | Avera";
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-10">
          <p className="text-sm text-muted-foreground mb-2">Last updated: {new Date().getFullYear()}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Refund &amp; Cancellation Policy</h1>
          <p className="text-muted-foreground">
            This Refund &amp; Cancellation Policy explains how subscriptions, renewals, and refunds work for
            Avera&apos;s digital AI companion service.
          </p>
        </header>

        <section className="space-y-8 text-sm leading-relaxed md:text-base">
          <article className="space-y-3">
            <h2 className="text-xl font-semibold">1. Free trial</h2>
            <p>
              New users receive a limited free trial with a small number of complimentary messages so you can get
              to know your Avera companion before subscribing. During the free trial, you will not be charged.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">2. Subscriptions and renewals</h2>
            <p>
              After your free trial ends, continued access to premium features (such as unlimited messaging,
              voice replies, advanced memory, and gifts) requires an active paid subscription. Subscription
              pricing and billing periods (for example, weekly or monthly) may vary by country and currency.
            </p>
            <p>
              Subscriptions are set to renew automatically at the end of each billing period unless you cancel
              before renewal. Renewal dates and current plan details are shown in your account or purchase
              confirmation.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">3. How to cancel</h2>
            <p>
              You can cancel your subscription at any time before the next renewal. In most cases, you can do
              this directly through the same platform you used to subscribe or by contacting our support team.
            </p>
            <p>
              When you cancel, your subscription will remain active until the end of the current billing period.
              You will keep access to premium features during that time and you will not be charged for another
              period unless you restart your subscription.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">4. Refunds</h2>
            <p>
              Because Avera is a digital product that becomes available immediately, subscription charges are
              generally non-refundable once a billing period has started.
            </p>
            <p>
              However, we understand that mistakes can happen. In special cases – for example, if you were
              charged in error, experienced a confirmed technical issue that prevented access, or are entitled to
              a refund under your local consumer protection laws – we may issue a partial or full refund at our
              reasonable discretion.
            </p>
            <p>
              To request a refund review, please contact us with your account email, payment receipt, and a brief
              description of the issue.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">5. One-time purchases and gifts</h2>
            <p>
              From time to time, Avera may offer one-time digital purchases such as in-app gifts or credit
              bundles. Because these are consumed digitally inside the experience, they are generally not
              refundable once delivered to your account, except where required by law.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">6. Payment processing</h2>
            <p>
              Payments for Avera are processed by trusted third-party providers such as Razorpay (particularly
              for users in India) and, in some regions, Stripe or similar services. These providers handle your
              payment information securely on our behalf in accordance with their own policies.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="text-xl font-semibold">7. Contact</h2>
            <p>
              If you have questions about this policy, cancellations, or a specific charge, please reach out to
              us at:
            </p>
            <p className="font-medium">support@avera.app</p>
          </article>
        </section>
      </section>
    </main>
  );
};

export default RefundCancellationPolicy;
