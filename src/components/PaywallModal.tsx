import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaywallModal = ({ open, onOpenChange }: PaywallModalProps) => {
  const { toast } = useToast();

  const plans = [
    {
      name: 'Weekly Plan',
      price: '$9.99',
      period: '/week',
      features: [
        'Unlimited messages',
        'All emotional modes',
        'Voice messages',
        'Priority support',
      ],
    },
    {
      name: 'Monthly Plan',
      price: '$29.99',
      period: '/month',
      features: [
        'Unlimited messages',
        'All emotional modes',
        'Voice messages',
        'Priority support',
        'Exclusive features',
        'Advanced memory',
      ],
      recommended: true,
    },
  ];

  const handleSubscribe = (planName: string) => {
    toast({
      title: "Coming Soon!",
      description: `${planName} checkout will be available soon. Stripe integration is ready for your API keys.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold">
            Continue Your Journey
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            Your free trial is complete. Choose a plan to keep connecting with your AI partner.
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-6 relative ${
                plan.recommended ? 'border-primary border-2 shadow-glow' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Recommended
                </div>
              )}

              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleSubscribe(plan.name)}
                  className={`w-full py-6 rounded-2xl ${
                    plan.recommended
                      ? 'bg-gradient-primary text-white shadow-glow'
                      : ''
                  }`}
                  variant={plan.recommended ? 'default' : 'outline'}
                >
                  Subscribe Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Cancel anytime. Your data is always safe and private.
        </p>
      </DialogContent>
    </Dialog>
  );
};
