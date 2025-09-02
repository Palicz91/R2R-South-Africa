import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Layout from '../components/Layout';
import PublicNavBar from '../components/PublicNavBar';
import Footer from '../components/Footer';

export default function TermsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const TermsContent = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-none">
        <h1>Terms & Conditions</h1>
        <p className="text-lg font-medium text-gray-600 mb-8">
          <strong>Effective Date:</strong> June 23, 2025<br />
          <strong>Legal Entity:</strong> Palicz Growth Solutions LP<br />
          <strong>Address:</strong> 2967 Dundas Street West, Suite 63, Toronto, Ontario, M6P1Z2, Canada<br />
          <strong>Contact Email:</strong> <a href="mailto:hello@reviewtorevenue.io">hello@reviewtorevenue.io</a>
        </p>

        <h2>1. ACCEPTANCE OF TERMS</h2>
        <p>
          These Terms & Conditions ("Terms") constitute a legally binding agreement between you ("Client," "Customer," "you," or "your") and Palicz Growth Solutions LP, operating as Review to Revenue ("Company," "we," "us," or "our") governing your access to and use of the reviewtorevenue.io website and our review management and revenue optimization services (collectively, the "Services").
        </p>
        <p>
          By creating an account, accessing our website, or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use our Services.
        </p>
        <p>
          If you are entering into these Terms on behalf of a company or organization, you represent and warrant that you have the authority to bind such entity to these Terms.
        </p>

        <h2>2. DESCRIPTION OF SERVICES</h2>

        <h3>2.1 Review Management Services</h3>
        <p>We provide a comprehensive platform for collecting, managing, and optimizing customer reviews, including:</p>
        <ul>
          <li>Automated review invitation campaigns</li>
          <li>Multi-platform review syndication</li>
          <li>Review response management tools</li>
          <li>Analytics and reporting dashboards</li>
          <li>Review widget integration</li>
          <li>Reputation monitoring and alerts</li>
          <li>Prize/reward distribution system for reviewers</li>
        </ul>

        <h3>2.2 Email List Building and Newsletter Services</h3>
        <ul>
          <li>Post-review newsletter subscription management</li>
          <li>Consent-based email address collection and transfer</li>
          <li>Email list building tools with proper opt-in procedures</li>
          <li>Subscription tracking and analytics</li>
          <li>Compliance management for email marketing regulations</li>
        </ul>

        <h3>2.3 Revenue Optimization Features</h3>
        <ul>
          <li>Review-based marketing automation</li>
          <li>Customer feedback analysis</li>
          <li>Conversion optimization tools</li>
          <li>Revenue attribution tracking</li>
          <li>Customer journey mapping</li>
          <li>Competitive analysis reporting</li>
        </ul>

        <h3>2.4 Integration Services</h3>
        <ul>
          <li>E-commerce platform integrations</li>
          <li>CRM system connections</li>
          <li>Marketing automation tool linkages</li>
          <li>Social media platform syndication</li>
          <li>Third-party application APIs</li>
        </ul>

        <h2>3. EMAIL COLLECTION AND NEWSLETTER SUBSCRIPTION PROCESS</h2>

        <h3>3.1 Post-Review Email Collection</h3>
        <p>When customers complete reviews and claim prizes/rewards:</p>
        <ul>
          <li>Customers are presented with an optional newsletter subscription opportunity</li>
          <li>Clear disclosure is provided about what they're subscribing to</li>
          <li>Explicit consent is required before any email address transfer</li>
          <li>Email addresses are ONLY transferred to you after confirmed subscription consent</li>
          <li>All email transfers are logged and tracked for compliance</li>
        </ul>

        <h3>3.2 Consent Requirements</h3>
        <ul>
          <li>All newsletter subscriptions must be genuinely opt-in</li>
          <li>Customers must actively consent (no pre-checked boxes)</li>
          <li>Clear information about subscription content and frequency must be provided</li>
          <li>Customers retain the right to unsubscribe at any time</li>
          <li>You may only use transferred emails for the disclosed newsletter purposes</li>
        </ul>

        <h3>3.3 Your Responsibilities for Email Marketing</h3>
        <p>You agree to:</p>
        <ul>
          <li>Only use transferred emails for legitimate newsletter and marketing purposes</li>
          <li>Provide clear unsubscribe mechanisms in all communications</li>
          <li>Honor unsubscribe requests promptly</li>
          <li>Comply with all applicable email marketing laws (CAN-SPAM, GDPR, etc.)</li>
          <li>Not sell, share, or transfer collected emails to third parties</li>
          <li>Maintain proper consent records and documentation</li>
        </ul>

        <h2>4. ACCOUNT REGISTRATION AND ELIGIBILITY</h2>

        <h3>4.1 Account Requirements</h3>
        <p>To use our Services, you must:</p>
        <ul>
          <li>Be at least 18 years of age or the age of majority in your jurisdiction</li>
          <li>Provide accurate, current, and complete registration information</li>
          <li>Maintain a valid email address and payment method</li>
          <li>Operate a legitimate business with genuine customer interactions</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Agree to follow ethical email marketing practices</li>
        </ul>

        <h3>4.2 Account Responsibility</h3>
        <p>You are responsible for:</p>
        <ul>
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Updating your account information when changes occur</li>
          <li>Notifying us immediately of any unauthorized use</li>
          <li>Ensuring compliance with these Terms by all account users</li>
          <li>Proper handling of customer email addresses and newsletter subscriptions</li>
        </ul>

        <h2>5. SUBSCRIPTION PLANS AND BILLING</h2>

        <h3>5.1 Subscription Terms</h3>
        <ul>
          <li>Services are provided on a subscription basis</li>
          <li>Subscription periods are typically monthly or annual</li>
          <li>Pricing is based on your selected plan and usage levels</li>
          <li>All fees are exclusive of applicable taxes unless otherwise stated</li>
        </ul>

        <h3>5.2 Payment Terms</h3>
        <ul>
          <li>Fees are charged in advance for each subscription period</li>
          <li>Payment is due immediately upon subscription activation</li>
          <li>We accept major credit cards and other payment methods as available</li>
          <li>All payments are non-refundable except as expressly provided</li>
        </ul>

        <h3>5.3 Billing Cycles</h3>
        <ul>
          <li>Monthly subscriptions renew automatically each month</li>
          <li>Annual subscriptions renew automatically each year</li>
          <li>Billing occurs on the same day each period unless otherwise specified</li>
          <li>Pro-rated charges may apply for mid-cycle upgrades</li>
        </ul>

        <h3>5.4 Price Changes</h3>
        <ul>
          <li>We may modify subscription prices with 30 days' advance notice</li>
          <li>Price changes take effect at your next renewal date</li>
          <li>You may cancel your subscription before the new pricing takes effect</li>
          <li>Continued use after price changes constitutes acceptance</li>
        </ul>

        <h3>5.5 Overages and Usage Limits</h3>
        <ul>
          <li>Certain plans include usage limits (e.g., number of review invitations, email transfers)</li>
          <li>Overage charges may apply for exceeding plan limits</li>
          <li>We will notify you when approaching usage limits</li>
          <li>Overage fees are billed monthly in arrears</li>
        </ul>

        <h2>6. ACCEPTABLE USE POLICY</h2>

        <h3>6.1 Permitted Uses</h3>
        <p>You may use our Services for:</p>
        <ul>
          <li>Legitimate business review collection and management</li>
          <li>Genuine customer feedback solicitation</li>
          <li>Lawful marketing and promotional activities</li>
          <li>Compliance with applicable regulations</li>
          <li>Ethical email list building with proper consent</li>
        </ul>

        <h3>6.2 Prohibited Activities</h3>
        <p>You must not:</p>
        <ul>
          <li>Solicit fake, misleading, or fraudulent reviews</li>
          <li>Offer excessive or inappropriate incentives for reviews or newsletter subscriptions</li>
          <li>Compensate customers specifically for positive reviews</li>
          <li>Review your own business or competitors</li>
          <li>Use our Services for any illegal purposes</li>
          <li>Violate platform policies of integrated services</li>
          <li>Attempt to manipulate review ratings or rankings</li>
          <li>Use customer emails for purposes other than disclosed newsletter content</li>
          <li>Send unsolicited emails or spam using collected addresses</li>
          <li>Sell, share, or transfer customer email addresses to third parties</li>
          <li>Collect or use customer data for unauthorized purposes</li>
          <li>Reverse engineer or attempt to access our source code</li>
          <li>Interfere with or disrupt our Services</li>
          <li>Upload malicious code or harmful content</li>
        </ul>

        <h3>6.3 Email Marketing Standards</h3>
        <p>All email marketing activities must:</p>
        <ul>
          <li>Comply with applicable laws (CAN-SPAM, GDPR, CASL, etc.)</li>
          <li>Include clear sender identification</li>
          <li>Provide easy unsubscribe mechanisms</li>
          <li>Honor opt-out requests within 10 business days</li>
          <li>Only send content consistent with what customers consented to receive</li>
          <li>Maintain proper consent documentation</li>
        </ul>

        <h2>7. DATA OWNERSHIP AND USAGE RIGHTS</h2>

        <h3>7.1 Your Data</h3>
        <p>You retain ownership of:</p>
        <ul>
          <li>Your business information and content</li>
          <li>Customer data you provide to us</li>
          <li>Review responses and content you create</li>
          <li>Your proprietary business processes and methods</li>
        </ul>

        <h3>7.2 Customer Email Addresses</h3>
        <ul>
          <li>Customer emails are transferred only with explicit consent</li>
          <li>You receive limited usage rights for newsletter and marketing purposes only</li>
          <li>Customers retain the right to revoke consent and request removal</li>
          <li>You must maintain proper consent records and honor unsubscribe requests</li>
        </ul>

        <h3>7.3 Review Data</h3>
        <ul>
          <li>Published reviews become publicly available content</li>
          <li>Reviewers retain rights to their review content</li>
          <li>We may use anonymized review data for analytics and research</li>
          <li>You have the right to respond to reviews about your business</li>
        </ul>

        <h3>7.4 Our Rights</h3>
        <p>We retain rights to:</p>
        <ul>
          <li>Our proprietary software and technology</li>
          <li>Aggregated and anonymized usage data</li>
          <li>Service improvements and feature development</li>
          <li>Our trademarks, logos, and brand materials</li>
        </ul>

        <h2>8. COMPLIANCE WITH EMAIL MARKETING LAWS</h2>

        <h3>8.1 Legal Compliance</h3>
        <p>You acknowledge and agree that:</p>
        <ul>
          <li>You are responsible for compliance with all applicable email marketing laws</li>
          <li>We provide tools to facilitate compliance but cannot guarantee legal compliance</li>
          <li>You must obtain proper legal advice for your specific jurisdiction</li>
          <li>Violations may result in account suspension or termination</li>
        </ul>

        <h3>8.2 Indemnification for Email Marketing</h3>
        <p>You agree to indemnify us against any claims, damages, or penalties arising from:</p>
        <ul>
          <li>Your email marketing practices</li>
          <li>Non-compliance with applicable email marketing laws</li>
          <li>Misuse of customer email addresses</li>
          <li>Violations of customer consent or privacy rights</li>
        </ul>

        <h2>9. INTELLECTUAL PROPERTY RIGHTS</h2>

        <h3>9.1 Our Intellectual Property</h3>
        <p>We own all rights to:</p>
        <ul>
          <li>The reviewtorevenue.io platform and software</li>
          <li>Our proprietary algorithms and methodologies</li>
          <li>Trademarks, service marks, and brand elements</li>
          <li>Documentation, training materials, and content</li>
          <li>Innovations and improvements to our Services</li>
        </ul>

        <h3>9.2 License to Use</h3>
        <p>We grant you a limited, non-exclusive, non-transferable license to use our Services in accordance with these Terms.</p>

        <h3>9.3 Your Content License</h3>
        <p>By using our Services, you grant us:</p>
        <ul>
          <li>A license to use your content for service provision</li>
          <li>Rights to display your business information publicly</li>
          <li>Permission to use your data for analytics and improvements</li>
          <li>Authority to syndicate reviews to third-party platforms</li>
        </ul>

        <h2>10. TERMINATION</h2>

        <h3>10.1 Termination by You</h3>
        <ul>
          <li>You may cancel your subscription at any time with 30 days' notice</li>
          <li>Cancellation takes effect at the end of your current billing period</li>
          <li>No refunds are provided for unused portions of prepaid subscriptions</li>
          <li>You may export your data before termination</li>
          <li>Email marketing lists and consent records should be maintained per legal requirements</li>
        </ul>

        <h3>10.2 Termination by Us</h3>
        <p>We may terminate your account:</p>
        <ul>
          <li>For breach of these Terms or our policies</li>
          <li>For fraudulent or illegal activity</li>
          <li>For violations of email marketing laws or unethical practices</li>
          <li>For non-payment of fees</li>
          <li>Upon 30 days' notice for any reason</li>
        </ul>

        <h3>10.3 Effect of Termination</h3>
        <p>Upon termination:</p>
        <ul>
          <li>Your access to our Services will cease</li>
          <li>We will retain your data as required by law</li>
          <li>Published reviews may remain publicly available</li>
          <li>You remain responsible for email marketing compliance and consent management</li>
          <li>Outstanding fees remain due and payable</li>
        </ul>

        <h2>11. WARRANTIES AND DISCLAIMERS</h2>

        <h3>11.1 Service Warranties</h3>
        <p>We warrant that our Services will:</p>
        <ul>
          <li>Perform substantially in accordance with our documentation</li>
          <li>Be provided with reasonable care and skill</li>
          <li>Include appropriate consent management tools for email collection</li>
        </ul>

        <h3>11.2 Disclaimers</h3>
        <p className="font-semibold">
          OUR SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p>WE DO NOT WARRANT:</p>
        <ul>
          <li>Compliance with all applicable email marketing laws in all jurisdictions</li>
          <li>That all collected email addresses will result in successful marketing campaigns</li>
          <li>That third-party email platforms will accept all transferred addresses</li>
          <li>The deliverability or effectiveness of your email marketing campaigns</li>
        </ul>

        <h2>12. LIMITATION OF LIABILITY</h2>

        <h3>12.1 Limitation of Damages</h3>
        <p className="font-semibold">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR OUR SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
        </p>

        <h3>12.2 Excluded Damages</h3>
        <p className="font-semibold">WE SHALL NOT BE LIABLE FOR:</p>
        <ul>
          <li>INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES</li>
          <li>LOST PROFITS, REVENUE, OR BUSINESS OPPORTUNITIES</li>
          <li>EMAIL MARKETING CAMPAIGN PERFORMANCE</li>
          <li>PENALTIES OR FINES FOR EMAIL MARKETING LAW VIOLATIONS</li>
          <li>DATA LOSS OR CORRUPTION</li>
          <li>THIRD-PARTY CLAIMS OR ACTIONS</li>
        </ul>

        <h2>13. INDEMNIFICATION</h2>
        <p>You agree to indemnify, defend, and hold harmless Palicz Growth Solutions LP and its officers, directors, employees, and agents from and against any claims, damages, losses, and expenses arising from:</p>
        <ul>
          <li>Your use of our Services</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of applicable laws, including email marketing regulations</li>
          <li>Your email marketing practices and customer communications</li>
          <li>Violations of customer consent or privacy rights</li>
          <li>Content you submit or publish</li>
          <li>Your customer relationships and business practices</li>
        </ul>

        <h2>14. GOVERNING LAW AND DISPUTE RESOLUTION</h2>

        <h3>14.1 Governing Law</h3>
        <p>These Terms are governed by the laws of Ontario, Canada without regard to conflict of law principles.</p>

        <h3>14.2 Dispute Resolution</h3>
        <p>Any disputes arising from these Terms shall be resolved through:</p>
        <ul>
          <li>Good faith negotiations</li>
          <li>Binding arbitration if negotiations fail</li>
          <li>Courts of competent jurisdiction in Ontario, Canada</li>
        </ul>

        <h2>15. GENERAL PROVISIONS</h2>

        <h3>15.1 Entire Agreement</h3>
        <p>These Terms, together with our Privacy Policy and any applicable service agreements, constitute the entire agreement between you and us.</p>

        <h3>15.2 Severability</h3>
        <p>If any provision of these Terms is deemed invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>

        <h3>15.3 Assignment</h3>
        <p>You may not assign these Terms without our written consent. We may assign these Terms in connection with a merger, acquisition, or sale of assets.</p>

        <h2>16. CONTACT INFORMATION</h2>
        <p>For questions about these Terms, contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:hello@reviewtorevenue.io">hello@reviewtorevenue.io</a></li>
          <li><strong>Address:</strong> Palicz Growth Solutions LP, 2967 Dundas Street West, Suite 63, Toronto, Ontario, M6P1Z2, Canada</li>
          <li><strong>Phone:</strong> <a href="tel:+4915143369633">+49 151 433 69 633</a></li>
        </ul>

        <h2>17. UPDATES TO TERMS</h2>
        <p>We may update these Terms periodically. We will notify you of material changes by email or through our platform. Continued use of our Services after changes constitutes acceptance of the updated Terms.</p>

        <h2>18. MONEY-BACK GUARANTEE</h2>
        <p>
          We want you to be genuinely happy with Review to Revenue. If you've actively used the platform and you're not satisfied, you may request a refund within 30 days of your first paid subscription charge ("Guarantee Window").
        </p>

        <h3>18.1 Eligibility (actual use required)</h3>
        <p>To qualify, your account must show meaningful use of core features during the Guarantee Window, such as:</p>
        <ul>
          <li>completed onboarding and setup, and</li>
          <li>created at least one active campaign or review flow, and</li>
          <li>used the product to collect reviews and/or email sign-ups (i.e., real customer interactions).</li>
        </ul>
        <p>
          Accounts that did not start using the product (no campaigns/live usage) are <strong>not</strong> eligible for a refund.
        </p>

        <h3>18.2 How to request a refund</h3>
        <p>
          Email <a href="mailto:hello@reviewtorevenue.io">hello@reviewtorevenue.io</a> with the subject line <strong>"Money Back Guarantee"</strong> and include:
        </p>
        <ul>
          <li>your account email,</li>
          <li>the date of your first paid charge, and</li>
          <li>a brief note on what fell short for you.</li>
        </ul>

        <h3>18.3 What happens next</h3>
        <ul>
          <li>We'll review eligibility based on actual usage and respond within 5–7 business days.</li>
          <li>Approved refunds are issued to the original payment method. Processing times may vary by provider.</li>
        </ul>

        <h3>18.4 Important notes</h3>
        <ul>
          <li>One refund per customer/account.</li>
          <li>Refunds apply only to the first payment within the Guarantee Window.</li>
          <li>Abuse, fraud, or policy violations void eligibility.</li>
          <li>This Guarantee does not limit any rights you may have under applicable law.</li>
        </ul>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800 mr-4">View Privacy Policy</Link>
            <Link to="/" className="text-blue-600 hover:text-blue-800">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If authenticated, use Layout
  if (isAuthenticated) {
    return (
      <Layout>
        <TermsContent />
      </Layout>
    );
  }

  // If not authenticated, use PublicNavBar and Footer
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavBar />
      <div className="flex-1">
        <TermsContent />
      </div>
      <Footer />
    </div>
  );
}