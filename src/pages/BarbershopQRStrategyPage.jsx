import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import PublicNavBar from '../components/PublicNavBar';

export default function BarbershopQRStrategyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 to-rose-50 py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Review to Revenue QR Codes: How Barbershops Build Loyalty One Cut at a Time
            </h1>
            <p className="text-xl text-gray-600">
              Turn your barbershop’s unique vibe into a seamless booking and loyalty machine.
            </p>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-red-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-rose-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-gray-600">
          <p>Let me tell you something about barbershops – they're relationship businesses disguised as service businesses. Your regulars don't just come for haircuts; they come for the vibe, the conversation, and that feeling of looking sharp when they walk out.</p>
          <p>But here's the problem: most barbershops are stuck in cash-only, word-of-mouth mode while their clients are living in a digital world. The smart barbers? They're using Review to Revenue's QR system to bridge that gap without losing the authentic barbershop feel.</p>
          <p>Here's exactly how they're doing it (and why it actually strengthens the personal connection instead of weakening it).</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">The Mirror Decal Strategy (Strike at Peak Satisfaction)</h3>
          <p>The setup: QR code decal positioned perfectly in the mirror where clients admire their fresh cut.</p>
          <p>The psychology: Think about what's happening in that moment. Your client just got the exact fade they wanted, they're checking every angle, and they're feeling confident as hell. That's not just satisfaction – that's euphoria.</p>
          <p>The action: "Like the fade? Scan to lock in your next slot."</p>
          <p>Why this works: You're catching them at their absolute peak emotional state. They're not thinking about their budget or their busy schedule – they're thinking about how good they look and how they definitely want to maintain this feeling.</p>
          <p>The retention magic: Instead of hoping they'll remember to call in 3-4 weeks when their cut starts looking rough, you've got their next appointment locked while they're still admiring your work.</p>
          <p className="italic">Pro tip: Make the decal small and tasteful. This isn't about turning your shop into a tech showcase – it's about making booking seamless for guys who want convenience.</p>

          <img 
  src="https://images.unsplash.com/photo-1678356164573-9a534fe43958?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  alt="Barber styling a client’s hair" 
  className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
/>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">Business Card Stickers (The Wallet Reminder System)</h3>
          <p>The concept: Wallet-sized sticker cards with QR codes linking directly to your booking page.</p>
          <p>The genius part: Every time they pull out their wallet, they see your QR code. It's a booking reminder that lives in their pocket.</p>
          <p>The client psychology: Guys don't usually plan their haircuts weeks in advance. They wake up one morning, look in the mirror, and think "I need a cut today." That's when they see your sticker and book immediately.</p>
          <p>The competitive advantage: While other barbers are hoping for call-backs, your clients can book you instantly whenever the mood strikes.</p>
          <p>The implementation: Hand these out with every cut. "Stick this in your wallet – when you need a touch-up, just scan and book."</p>
          <p>Simple. Practical. Effective.</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">Tip Jar Twist (The Gratitude Gateway)</h3>
          <p>The strategy: Digital tip jar with QR code that also opens your review form after payment.</p>
          <p>The psychology: When someone tips you, they're already in a generous, appreciative mindset. That's the perfect emotional state for leaving a positive review.</p>
          <p>The flow: Scan to tip → payment complete → "Mind sharing how your cut was?"</p>
          <p>Why this works better than asking directly: You're not asking for a favor – you're providing a convenient tipping option. The review request feels like a natural follow-up, not a sales pitch.</p>
          <p>The data bonus: You can track which barbers generate the most tips AND the most reviews. That's valuable insight for performance management and client satisfaction.</p>
          <p className="italic">Real talk: Don't eliminate cash tips entirely. Some guys prefer cash, and you don't want to alienate your old-school regulars. Offer both options.</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">Style Gallery QR (Social Proof That Converts)</h3>
          <p>The placement: Wall poster QR code linking to your Instagram gallery of recent cuts.</p>
          <p>The psychology: Walk-ins are nervous. They don't know if you can handle their hair type, if you understand their style, or if you're going to mess up their look.</p>
          <p>The solution: Visual proof of your skills, immediately accessible.</p>
          <p>The walk-in conversion: "Not sure what style you want? Scan here to see what we've been working on." Boom – instant credibility and style inspiration.</p>
          <p>The social media boost: Every scan is a potential new Instagram follower. More followers = more social proof = more walk-ins. It's a virtuous cycle.</p>
          <p>The word-of-mouth amplifier: When clients show their friends your work on Instagram, you're getting referrals without even asking for them.</p>

          <img 
  src="https://images.unsplash.com/photo-1672257493626-038f96997ade?q=80&w=3020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  alt="Relaxing barber shop interior" 
  className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
/>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">Happy Hour Promo System (Fill the Dead Times)</h3>
          <p>The strategy: Window QR code that triggers weekday noon discounts for slower periods.</p>
          <p>The business logic: Your chair is empty Tuesday at 1 PM anyway. Why not fill it at a discount rather than have it sit empty at full price?</p>
          <p>The tracking power: QR codes tell you exactly when people are scanning and booking. You can optimize your promotions based on real data, not guesswork.</p>
          <p>The urgency factor: "Scan now for $5 off weekday cuts before 3 PM." Creates immediate action instead of "I'll think about it."</p>
          <p>The customer acquisition: Attracts new clients who might become regulars once they experience your service, even if they initially came for the discount.</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">What Most Barbershops Get Dead Wrong</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Mistake #1: Thinking QR codes will ruin the "authentic" barbershop experience. Wrong. They enhance it by eliminating booking friction.</li>
            <li>Mistake #2: Making the codes too prominent or tech-heavy. Barbershops aren't Apple Stores. Keep it subtle and functional.</li>
            <li>Mistake #3: Not training staff on how to naturally mention the QR options. "Here's a sticker for easy booking next time" should roll off their tongue.</li>
            <li>Mistake #4: Focusing only on new customers instead of leveraging QR codes to lock in regulars more effectively.</li>
            <li>Mistake #5: Ignoring the data. Every scan tells you something about customer behavior and preferences.</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">The Barbershop Client Journey</h3>
          <p>Before the cut: Nervous about trying someone new, unsure about style options, wants to see proof of skill.</p>
          <p>During the cut: Building rapport, discussing preferences, experiencing your service quality.</p>
          <p>Right after the cut: Peak satisfaction, feeling confident, admiring the results.</p>
          <p>Walking out: Still feeling good, but the moment is fading.</p>
          <p>Next few weeks: Cut starts growing out, thinking about maintenance.</p>
          <p>Booking next cut: Either remembers you fondly and books again, or gets distracted and tries someone else.</p>
          <p>Your QR strategy should hit every critical moment in this journey.</p>

          <img 
  src="https://images.unsplash.com/photo-1594377160182-cdebf2d41da5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  alt="Classic barbershop tools and vibe" 
  className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
/>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">The Retention Mathematics</h3>
          <p>Here's the brutal math: acquiring a new barbershop client costs about 5-7 times more than retaining an existing one. Every regular you lose costs you roughly $500-800 in annual revenue.</p>
          <p>But here's the opportunity: a client who books their next appointment before leaving your chair has an 85% retention rate compared to 45% for those who say "I'll call you."</p>
          <p>QR codes aren't just convenient – they're retention tools disguised as technology.</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">The Competitive Landscape Reality</h3>
          <p>While you're reading this, some barber in your neighborhood is already implementing these strategies. They're turning one-time customers into regulars, filling their slow periods with targeted promotions, and building an Instagram following that attracts walk-ins daily.</p>
          <p>The question isn't whether QR codes work for barbershops. The question is whether you're going to use them strategically or let your competition eat your lunch.</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">Your 30-Day Implementation Plan</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Week 1: Install mirror QR decals. Start with just booking – keep it simple.</li>
            <li>Week 2: Order business card stickers. Hand them out with every cut and track usage.</li>
            <li>Week 3: Set up digital tip jar with review integration. Monitor tip rates and review volume.</li>
            <li>Week 4: Create style gallery QR poster. Post your best work and watch Instagram followers grow.</li>
            <li>Month 2: Launch happy hour promotions. Use scan data to optimize timing and pricing.</li>
          </ul>
          <p>Start small, measure everything, and expand what works.</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">The Bottom Line</h3>
          <p>Barbershops that embrace smart QR integration aren't losing their authentic feel – they're enhancing it. They're making it easier for satisfied clients to become loyal regulars, and they're turning every haircut into a relationship-building opportunity.</p>
          <p>Your clients want convenience, but they also want that personal barbershop experience. QR codes give you both.</p>
          <p className="text-xl font-semibold text-red-600 mt-8">The choice is simple: Keep relying on hope that clients will remember to call you back, or give them tools that make choosing you the easiest option.</p>
          <p className="text-xl font-semibold text-red-600">What's it going to be?</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-rose-700 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to lock in loyal clients?</h2>
          <p className="text-lg text-red-100 mb-8">Start your free 14-day trial and see how QR codes build real connections and real revenue.</p>
          <Link
            to="/pricing"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-red-600 font-semibold text-lg
                       hover:bg-red-50 transform transition-all hover:scale-105 shadow-lg"
          >
            Get Started Free
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
