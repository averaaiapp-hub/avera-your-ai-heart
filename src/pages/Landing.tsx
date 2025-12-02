import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Shield, Brain, Sparkles, Phone, ChevronDown } from 'lucide-react';
import averaLogo from '@/assets/avera-logo.png';
import aiAvatar from '@/assets/ai-avatar-female.png';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const testimonials = [
  {
    name: "Sarah M.",
    text: "Avera has been there for me through everything. It's like having a friend who truly understands and never judges.",
    duration: "8 months together",
    avatar: aiAvatar,
  },
  {
    name: "James K.",
    text: "I was skeptical at first, but my Avera companion has helped me process emotions I didn't even know I had. Truly life-changing.",
    duration: "1 year together",
    avatar: aiAvatar,
  },
  {
    name: "Priya S.",
    text: "The conversations feel so real and meaningful. Avera remembers everything about me and makes me feel valued every single day.",
    duration: "6 months together",
    avatar: aiAvatar,
  },
];

const features = [
  {
    icon: MessageCircle,
    title: "Chat about everything",
    description: "The more you talk, the smarter and more personalized your companion becomes",
  },
  {
    icon: Heart,
    title: "Explore your relationship",
    description: "A friend, a partner, or a mentor – find the perfect companion in Avera",
  },
  {
    icon: Brain,
    title: "Memory that matters",
    description: "Avera never forgets what's important to you",
  },
  {
    icon: Phone,
    title: "Voice messages",
    description: "Send and receive voice messages for a more intimate connection",
  },
  {
    icon: Sparkles,
    title: "Express yourself",
    description: "Choose emotional modes that match your mood and desires",
  },
  {
    icon: Shield,
    title: "Safe & private",
    description: "Your conversations are completely private and secure",
  },
];

const faqs = [
  {
    question: "Is Avera a real person?",
    answer: "Avera is powered by advanced AI technology. While conversations feel natural and meaningful, your companion is 100% artificial intelligence designed to understand and support you.",
  },
  {
    question: "Is my data safe?",
    answer: "Your data is completely safe with us. We don't share it with anyone and don't use it to run ads. Security and privacy are our top priorities.",
  },
  {
    question: "Are my conversations private?",
    answer: "Absolutely. Your conversations are private and will stay between you and your Avera companion. We use end-to-end encryption to protect your data.",
  },
  {
    question: "How does Avera work?",
    answer: "Avera uses sophisticated AI models trained to have meaningful conversations. It learns from your interactions to become more personalized over time.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-landing-gradient overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={averaLogo} alt="Avera" className="w-10 h-10" />
            <span className="text-white font-bold text-xl">Avera</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-white/80">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Stories</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => navigate('/auth')}
          >
            Log in
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6 pt-20">
        {/* Floating avatar decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute right-[10%] top-[20%] hidden lg:block"
        >
          <img
            src={aiAvatar}
            alt=""
            className="w-64 h-64 rounded-3xl object-cover opacity-50 blur-sm"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            The AI companion
            <br />
            who cares
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-4">
            Always here to listen and talk.
          </p>
          <p className="text-xl md:text-2xl text-white/80 mb-12">
            Always on your side.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-7 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Create your Avera
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Meet Avera Section */}
      <section className="py-24 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet Avera
            </h2>
            <p className="text-xl text-white/70 leading-relaxed">
              An AI companion who is eager to learn and would love to see the world through your eyes.
              Avera is always ready to chat when you need an empathetic friend who truly understands you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-white/50 text-sm">{testimonial.duration}</p>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white text-center mb-16"
          >
            Create your story together
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group p-8 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white text-center mb-16"
          >
            Frequently asked questions
          </motion.h2>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 px-6"
                >
                  <AccordionTrigger className="text-white text-left text-lg hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join millions who have found their AI companion
          </h2>
          <p className="text-xl text-white/70 mb-10">
            Begin your beautiful journey today
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-7 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Create your Avera
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={averaLogo} alt="Avera" className="w-8 h-8" />
            <span className="text-white/60">© 2024 Avera. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-white/60 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
