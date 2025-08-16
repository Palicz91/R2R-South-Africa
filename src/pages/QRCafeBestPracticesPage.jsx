import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import PublicNavBar from '../components/PublicNavBar';

export default function QRCafeBestPracticesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">QR Code Review Capture: Best Practices That Actually Work</h1>
            <p className="text-xl text-gray-600">
              Because nobody scans QR codes unless there's something in it for them
            </p>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-gray-600">
          <p>Let's be honest—most QR codes are digital tumbleweeds. They sit there, ignored, while business owners wonder why their review requests fall flat. But here's the thing: when you nail the timing and incentive, QR codes become review-generating machines.</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">The Golden Rule: Capture During the Micro-Moment</h3>
          <img
            src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Café queue - micro-moment capture"
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />
          <p>Your QR code isn't competing with Netflix or Instagram. It's competing with boredom, waiting, and that awkward "what do I do with my hands" feeling. Win that battle, and you win reviews.</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">The Café Playbook (And Why It's Genius)</h3>
      
          <h4 className="text-xl font-semibold mt-4">The Barista Zone Play</h4>
          <p>Place your QR code on the espresso machine splash guard. Why? Because people stare at that machine while waiting for their latte. Queue time equals capture window. It's psychology 101—give people something to do when they're already doing nothing.</p>

          <h4 className="text-xl font-semibold mt-4">The Wi-Fi Hostage Strategy</h4>
          <p>Want Wi-Fi? Scan first. But here's the twist: the review prompt comes after their session, when they've gotten value. You're not holding their internet hostage for a review—you're creating a grateful moment. That's the difference between annoying and brilliant.</p>

          <h4 className="text-xl font-semibold mt-4">The Loyalty Hack</h4>
          <p>Your stamp card lives behind the QR code. Sixth scan gets them a free coffee. Now your QR isn't just a review request—it's a reward system. People want to scan because there's treasure at the end.</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">Universal Principles That Work Everywhere</h3>
          <h4 className="text-xl font-semibold mt-4">1. Timing Is Everything</h4>
          <p>Don't ask for reviews when people are rushing in. Ask when they're:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Waiting (like that espresso queue)</li>
            <li>Relaxed (post-service satisfaction)</li>
            <li>Already engaged with your brand (using your Wi-Fi)</li>
          </ul>

          <h4 className="text-xl font-semibold mt-4">2. Value Before Ask</h4>
          <p>The Wi-Fi strategy works because you give first, ask second. What can you give away for free that makes the scan worthwhile, even without the review?</p>

          <h4 className="text-xl font-semibold mt-4">3. Make It Social-Worthy</h4>
          <p>The coffee cup origin story QR? That's not just about reviews—it's about creating shareable content. When people share your QR-generated content, you get organic reach and social proof.</p>

          <h4 className="text-xl font-semibold mt-4">4. Layer Your Incentives</h4>
          <p>Don't just ask for a review. Make your QR code do triple duty:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Immediate value (Wi-Fi, discount, content)</li>
            <li>Progressive reward (loyalty points, stamps)</li>
            <li>Social shareability (stories, photos, experiences)</li>
          </ul>
          
    <img
            src="https://images.unsplash.com/photo-1564327367919-cb377ea6a88f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Café barista zone - prime placement"
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8">Adapting the Café Tactics to Your Business</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Restaurants: QR on the check presenter linking to chef's signature dish video + review prompt</li>
            <li>Retail: Fitting room QR for styling tips + review request after purchase</li>
            <li>Services: QR in waiting area for behind-the-scenes content + post-appointment review</li>
            <li>Hotels: Room service menu QR with local experiences + checkout review prompt</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">The Psychology Behind the Success</h3>
          <p>People don't resist QR codes—they resist pointless QR codes. When your code promises value and delivers it, scanning becomes habitual. When it ties to something they already want (Wi-Fi, loyalty points, entertainment), it becomes irresistible.</p>
          <p>The secret sauce isn't the technology. It's understanding that people will gladly trade a review for something they actually value.</p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8">Your QR Review Strategy Checklist</h3>
          <p>Before you print that code, ask yourself:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>What's in it for them right now?</li>
            <li>When are they most likely to have 30 seconds and nothing better to do?</li>
            <li>How can I make this scan feel like a win, not a chore?</li>
            <li>What value can I deliver immediately, before asking for anything?</li>
          </ul>
          <p>Remember: Your QR code isn't just a bridge to a review form. It's a micro-experience that should leave people thinking, "That was actually useful."</p>
          <p className="text-xl font-semibold text-blue-600 mt-8">The best review requests don't feel like requests at all. They feel like rewards.</p>
          <img
            src="https://images.unsplash.com/photo-1575623811814-dfbb2c13e4ad?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Coffee cup loyalty program"
            className="w-full h-64 object-cover rounded-xl shadow-lg my-8"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to turn reviews into revenue?</h2>
          <p className="text-lg text-blue-100 mb-8">Start your free 14-day trial. No credit card needed.</p>
          <Link
            to="/pricing"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold text-lg
                       hover:bg-blue-50 transform transition-all hover:scale-105 shadow-lg"
          >
            Get Started Free
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
