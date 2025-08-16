import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Layout from '../components/Layout';
import PublicNavBar from '../components/PublicNavBar';
import Footer from '../components/Footer';

export default function PrivacyPolicyPage() {
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

  const PrivacyContent = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-none">
        <h1>Privacy Policy</h1>
        <p className="text-lg font-medium text-gray-600 mb-8">Effective Date: June 23, 2025</p>

        <h2>1. INTRODUCTION</h2>
        <p>
          Review to Revenue ("we," "us," "our," or the "Company") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website reviewtorevenue.io (the "Website") and use our review management and revenue optimization services (the "Services").
        </p>
        <p>
          This Privacy Policy applies to all users of our Website and Services, including business clients, reviewers, and website visitors. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
        </p>

        <h2>2. INFORMATION WE COLLECT</h2>
        
        <h3>2.1 Personal Information You Provide</h3>
        <ul>
          <li>Account registration information (name, email address, phone number, company name, business address)</li>
          <li>Payment and billing information (credit card details, billing address, tax identification numbers)</li>
          <li>Business profile information (website URL, industry type, company size, business description)</li>
          <li>Communication preferences and marketing consent</li>
          <li>Support ticket information and correspondence</li>
          <li>Profile photos and company logos</li>
          <li>Review responses and content you submit</li>
        </ul>

        <h3>2.2 Information Collected from Your Customers (Reviewers)</h3>
        <p>When you use our Services to collect reviews, we may collect:</p>
        <ul>
          <li>Customer names and email addresses (provided by you or your customers)</li>
          <li>Review content, ratings, and feedback</li>
          <li>Customer verification information (when customers verify their reviews)</li>
          <li>Social media profile information (if customers choose to verify through social media)</li>
          <li>Photos and videos submitted with reviews</li>
          <li>IP addresses and location data of reviewers</li>
          <li>Device information and browser data</li>
          <li>Newsletter subscription preferences and consent status</li>
          <li>Prize/reward claim information and preferences</li>
        </ul>

        <h3>2.3 Newsletter Subscription and Email Sharing Process</h3>
        <p>When reviewers complete a review and claim a reward/prize:</p>
        <ul>
          <li>We collect explicit consent for newsletter subscriptions to your business</li>
          <li>Email addresses are only shared with you after explicit subscriber consent</li>
          <li>We track subscription status and consent timestamps</li>
          <li>Opt-in confirmation data and double opt-in verification</li>
          <li>Subscription source attribution (review-to-subscription tracking)</li>
        </ul>

        <h3>2.4 Automatically Collected Information</h3>
        <ul>
          <li>IP addresses and geolocation data</li>
          <li>Browser type, version, and language settings</li>
          <li>Operating system and device information</li>
          <li>Website usage patterns and analytics data</li>
          <li>Cookies and similar tracking technologies</li>
          <li>Session recordings and heatmap data</li>
          <li>Search queries and interaction data</li>
          <li>Referral sources and campaign attribution data</li>
        </ul>

        <h3>2.5 Third-Party Information</h3>
        <ul>
          <li>Information from integrated platforms (Google, Facebook, Shopify, etc.)</li>
          <li>Public business information from directories and databases</li>
          <li>Social media profile information (when you connect social accounts)</li>
          <li>Payment processor information</li>
          <li>Email service provider data</li>
        </ul>

        <h2>3. HOW WE USE YOUR INFORMATION</h2>

        <h3>3.1 Service Provision</h3>
        <ul>
          <li>Providing and maintaining our review management Services</li>
          <li>Processing and displaying customer reviews</li>
          <li>Generating review invitations and follow-up communications</li>
          <li>Managing prize/reward distribution after review completion</li>
          <li>Processing newsletter subscription requests from reviewers</li>
          <li>Facilitating email list building with proper consent management</li>
          <li>Creating analytics reports and dashboards</li>
          <li>Facilitating review syndication across platforms</li>
          <li>Managing your account and providing customer support</li>
        </ul>

        <h3>3.2 Newsletter and Email Marketing Management</h3>
        <ul>
          <li>Collecting and verifying newsletter subscription consent from reviewers</li>
          <li>Transferring email addresses to business clients only after confirmed opt-in</li>
          <li>Providing subscription management tools for businesses</li>
          <li>Tracking subscription attribution and conversion rates</li>
          <li>Managing unsubscribe requests and consent withdrawal</li>
        </ul>

        <h3>3.3 Business Operations</h3>
        <ul>
          <li>Processing payments and managing billing</li>
          <li>Detecting and preventing fraud and abuse</li>
          <li>Enforcing our Terms & Conditions</li>
          <li>Complying with legal obligations and regulatory requirements</li>
          <li>Conducting internal research and product development</li>
          <li>Maintaining security and preventing unauthorized access</li>
        </ul>

        <h3>3.4 Marketing and Communications</h3>
        <ul>
          <li>Sending service-related notifications and updates</li>
          <li>Providing customer support and responding to inquiries</li>
          <li>Sending marketing communications (with your consent)</li>
          <li>Personalizing your experience and recommendations</li>
          <li>Conducting surveys and collecting feedback</li>
        </ul>

        <h2>4. INFORMATION SHARING AND DISCLOSURE</h2>

        <h3>4.1 Email Sharing with Business Clients</h3>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <p className="font-semibold text-yellow-800">IMPORTANT: Customer email addresses are only shared with our business clients under the following strict conditions:</p>
          <ul className="mt-2 text-yellow-700">
            <li>The customer has completed a genuine review</li>
            <li>The customer has claimed a prize/reward</li>
            <li>The customer has explicitly consented to join the business's newsletter/mailing list</li>
            <li>The customer has confirmed their subscription through our verification process</li>
            <li>All applicable privacy laws and consent requirements are met</li>
          </ul>
        </div>

        <h3>4.2 With Your Consent</h3>
        <p>We may share your information with third parties when you provide explicit consent or direct us to do so.</p>

        <h3>4.3 Service Providers</h3>
        <p>We share information with trusted third-party service providers who assist us in operating our business:</p>
        <ul>
          <li>Cloud hosting and infrastructure providers</li>
          <li>Payment processors and billing services</li>
          <li>Email and communication service providers</li>
          <li>Analytics and marketing platforms</li>
          <li>Customer support tools</li>
          <li>Security and fraud prevention services</li>
        </ul>

        <h3>4.4 Business Partners</h3>
        <ul>
          <li>Integration partners (e.g., e-commerce platforms, CRM systems)</li>
          <li>Review syndication partners (Google, Facebook, industry-specific platforms)</li>
          <li>Marketing and advertising partners (with your consent)</li>
        </ul>

        <h3>4.5 Legal Requirements</h3>
        <p>We may disclose information when required by law or when we believe disclosure is necessary to:</p>
        <ul>
          <li>Comply with legal obligations or court orders</li>
          <li>Protect our rights, property, or safety</li>
          <li>Investigate potential violations of our Terms</li>
          <li>Prevent fraud or other illegal activities</li>
        </ul>

        <h3>4.6 Business Transfers</h3>
        <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</p>

        <h2>5. REVIEWER RIGHTS AND NEWSLETTER SUBSCRIPTIONS</h2>

        <h3>5.1 Subscription Control</h3>
        <p>Reviewers have the right to:</p>
        <ul>
          <li>Choose whether to subscribe to business newsletters after leaving a review</li>
          <li>Receive clear information about what they're subscribing to</li>
          <li>Unsubscribe from business newsletters at any time</li>
          <li>Request deletion of their email from business mailing lists</li>
          <li>Withdraw consent for email sharing</li>
        </ul>

        <h3>5.2 Email Protection</h3>
        <ul>
          <li>We do not share reviewer email addresses without explicit consent</li>
          <li>Businesses cannot access reviewer emails unless subscription consent is given</li>
          <li>All email transfers are logged and tracked for compliance</li>
          <li>Reviewers can request information about which businesses have their email</li>
        </ul>

        <h2>6. DATA CONTROLLER VS. DATA PROCESSOR</h2>

        <h3>6.1 When We Are the Data Controller</h3>
        <p>We act as the Data Controller for:</p>
        <ul>
          <li>Account holder information</li>
          <li>Website visitor data</li>
          <li>Marketing and communication preferences</li>
          <li>Published reviews and associated reviewer information</li>
          <li>Analytics and usage data</li>
          <li>Newsletter subscription consent management</li>
        </ul>

        <h3>6.2 When We Are the Data Processor</h3>
        <p>We act as a Data Processor when:</p>
        <ul>
          <li>Processing customer data on behalf of our business clients</li>
          <li>Managing review invitations sent by our clients</li>
          <li>Handling customer information before reviews are submitted</li>
          <li>Managing newsletter subscriptions on behalf of business clients</li>
        </ul>

        <h2>7. INTERNATIONAL DATA TRANSFERS</h2>
        <p>
          We may transfer your personal data outside your country of residence, including to Canada and other countries where we or our service providers operate. We ensure appropriate safeguards are in place, including:
        </p>
        <ul>
          <li>Standard Contractual Clauses approved by relevant authorities</li>
          <li>Adequacy decisions by applicable data protection authorities</li>
          <li>Other legally recognized transfer mechanisms</li>
        </ul>

        <h2>8. DATA RETENTION</h2>

        <h3>8.1 General Retention Periods</h3>
        <ul>
          <li><strong>Account information:</strong> Retained for the duration of your account plus 7 years for legal compliance</li>
          <li><strong>Review data:</strong> Retained indefinitely as published content (unless deletion is requested)</li>
          <li><strong>Newsletter subscription data:</strong> Retained until consent is withdrawn or 3 years of inactivity</li>
          <li><strong>Email sharing consent records:</strong> Retained for 7 years for compliance purposes</li>
          <li><strong>Marketing data:</strong> Retained until you withdraw consent or 3 years of inactivity</li>
          <li><strong>Analytics data:</strong> Retained for 26 months</li>
          <li><strong>Support communications:</strong> Retained for 7 years</li>
        </ul>

        <h2>9. YOUR RIGHTS AND CHOICES</h2>

        <h3>9.1 Access and Portability</h3>
        <ul>
          <li>Request access to your personal data</li>
          <li>Obtain a copy of your data in a structured format</li>
          <li>Request data portability to another service</li>
        </ul>

        <h3>9.2 Correction and Deletion</h3>
        <ul>
          <li>Correct inaccurate or incomplete information</li>
          <li>Request deletion of your personal data (subject to legal requirements)</li>
          <li>Request restriction of processing</li>
        </ul>

        <h3>9.3 Newsletter and Email Rights</h3>
        <ul>
          <li>Unsubscribe from business newsletters at any time</li>
          <li>Request removal of your email from specific business mailing lists</li>
          <li>Withdraw consent for email sharing with businesses</li>
          <li>Request information about which businesses have received your email</li>
        </ul>

        <h3>9.4 Marketing Communications</h3>
        <ul>
          <li>Opt out of marketing emails via unsubscribe links</li>
          <li>Update communication preferences in your account settings</li>
          <li>Contact us to withdraw consent</li>
        </ul>

        <h2>10. COOKIES AND TRACKING TECHNOLOGIES</h2>

        <h3>10.1 Types of Cookies We Use</h3>
        <ul>
          <li>Essential cookies for website functionality</li>
          <li>Analytics cookies for usage statistics</li>
          <li>Marketing cookies for advertising and personalization</li>
          <li>Preference cookies for user settings</li>
        </ul>

        <h3>10.2 Cookie Management</h3>
        <p>You can control cookies through:</p>
        <ul>
          <li>Your browser settings</li>
          <li>Our cookie preference center</li>
          <li>Third-party opt-out tools</li>
        </ul>

        <h2>11. SECURITY MEASURES</h2>
        <p>We implement appropriate technical and organizational security measures to protect your personal data:</p>
        <ul>
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security assessments and penetration testing</li>
          <li>Access controls and authentication mechanisms</li>
          <li>Employee training and background checks</li>
          <li>Incident response and breach notification procedures</li>
          <li>Regular backups and disaster recovery planning</li>
          <li>Secure email transfer protocols and consent verification systems</li>
        </ul>

        <h2>12. CHILDREN'S PRIVACY</h2>
        <p>
          Our Services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete such information promptly.
        </p>

        <h2>13. CALIFORNIA PRIVACY RIGHTS</h2>
        <p>California residents have additional rights under the California Consumer Privacy Act (CCPA):</p>
        <ul>
          <li>Right to know what personal information is collected</li>
          <li>Right to delete personal information</li>
          <li>Right to opt-out of the sale of personal information</li>
          <li>Right to non-discrimination for exercising privacy rights</li>
        </ul>

        <h2>14. EUROPEAN PRIVACY RIGHTS</h2>
        <p>Under the General Data Protection Regulation (GDPR), European residents have rights including:</p>
        <ul>
          <li>Right of access and data portability</li>
          <li>Right to rectification and erasure</li>
          <li>Right to restrict processing</li>
          <li>Right to object to processing</li>
          <li>Right to withdraw consent</li>
          <li>Right to lodge a complaint with supervisory authorities</li>
        </ul>

        <h2>15. CONTACT INFORMATION</h2>
        <p>For privacy-related questions or to exercise your rights, contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:hello@reviewtorevenue.io">hello@reviewtorevenue.io</a></li>
          <li><strong>Address:</strong> Palicz Growth Solutions LP, 2967 Dundas Street West, Suite 63, Toronto, Ontario, M6P1Z2, Canada</li>
          <li><strong>Phone:</strong> <a href="tel:+4915143369633">+49 151 433 69 633</a></li>
          <li><strong>Data Protection Officer:</strong> <a href="mailto:hello@reviewtorevenue.io">hello@reviewtorevenue.io</a></li>
        </ul>

        <h2>16. UPDATES TO THIS POLICY</h2>
        <p>We may update this Privacy Policy periodically. We will notify you of material changes by:</p>
        <ul>
          <li>Posting the updated policy on our website</li>
          <li>Sending email notifications to account holders</li>
          <li>Displaying prominent notices on our platform</li>
        </ul>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <Link to="/terms" className="text-blue-600 hover:text-blue-800 mr-4">View Terms & Conditions</Link>
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
        <PrivacyContent />
      </Layout>
    );
  }

  // If not authenticated, use PublicNavBar and Footer
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavBar />
      <div className="flex-1">
        <PrivacyContent />
      </div>
      <Footer />
    </div>
  );
}