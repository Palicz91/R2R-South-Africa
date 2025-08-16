export type Language = 'en' | 'hu' | 'de';

export const translations = {
  en: {
    // Review page
    reviewHeadline: "Spin & win!",
    reviewHeadlineShort: "Leave a review & win!",
    standachance: "Stand a chnace to win:",
    reviewThanks: "🎉 Thank you for the review! Now you can spin for prizes!",
    tapToRate: "Tap to rate your experience",
    leaveReview: "Leave a Google Review",
    spinWheel: "Spin the Wheel",
    spinning: "Spinning...",
    congratulations: "Congratulations!",
    youWon: "You've won:",
    getReward: "Get My Reward",
    emailPlaceholder: "you@example.com",
    emailPrivacy: "We'll only use your email to send your reward details.",
    emailMarketingOptIn: "I'd like to receive future promotions and discounts from {business_name}, and I accept the <a href='/privacy' target='_blank' class='underline text-blue-600'>Privacy Policy</a>.",
    sending: "Sending...",
    successMessage: "Your reward email was sent!<br><strong>Please also check your Spam or Promotions folder.</strong>",
    redirectingNotice: "We're opening the Google review page in a new tab. <strong>After you leave your review, close that tab and come back here to spin the wheel and claim your prize!</strong> 🎁",
    emailAlreadyUsed: "You've already participated in the giveaway with this email.",
    genericSaveError: "Something went wrong while saving your data. Please try again.",
    
    // Email template
    emailSubject: "Your reward from {businessName} is ready 🎁",
    emailGreeting: "Hey there,",
    emailThanks: "Thanks for being part of the {businessName} experience 🙌",
    emailWinMessage: "You spun the wheel—and you've just won",
    emailImportant: "Important:",
    emailQrOneTime: "Your QR code can only be used once",
    emailQrExpires: "It expires on",
    emailQrTitle: "🎁 Your reward QR code:",
    emailQrInstructions: "Show this QR code to staff to redeem your reward",
    emailQrBackupLinkText: "QR code hiding? You can open it here",
    emailClosing: "We hope this little surprise adds something nice to your day!",
    emailSignature: "With appreciation,",
    emailTeam: "The {businessName} team",
    emailPS: "PS: Know someone who could benefit from getting more Google reviews and turning them into revenue?",
    emailPSLinkText: "👉 Try Review to Revenue – simple, powerful, and made for local businesses 🚀",
    downloadYourPrize: "Download your prize",

    // QR redeem page
    redeemTitle: "Your Reward",
    you_won_title: '🎁 You won:',
    rewardExpired: "This reward has expired",
    rewardRedeemed: "This reward has already been redeemed",
    redeemButton: "Redeem Reward",
    use_coupon_label: 'Use this coupon code at checkout:',
    redeeming: "Redeeming...",
    expiresOn: "Expires on",

    // Wheel preview additions
    availablePrizes: "Available Prizes",
    previewOfGuests: "Preview of what your guests will see",
    editProject: "Edit Project",
    backToProjects: "Back to Projects",

    // Review timing section - NEW
    reviewTimingParagraph: "After paying, your guest is smiling with their phone in hand—ready to tell the world how great the experience was. If you miss this moment, it becomes much harder to motivate them later. Instead of asking for a review days later (if you even remember in the daily grind), give them a 60-second game they'll enjoy playing. They get a reward, you get a fresh Google review. Everybody wins.",
    reviewTimingHeadline: "Turn satisfied guests into your most powerful marketing channel – with reviews that multiply your revenue!",

    // Landing page
    landingHeroHeadline: "REVIEW TO REVENUE",
    landingHeroSubline: `Google Reviews are the first impression of your business. Potential guests always choose the place with more and better reviews. Review-to-Revenue is an <span class="text-[#4FC3F7] font-semibold">automatic and playful solution</span> that keeps the stars – and the revenue – flowing.<br><span class="block text-sm sm:text-base mt-2 text-gray-600"><em>More effective than a marketing agency – and costs just a fraction.</em></span>`,
    landingHeroCta: "Show me the solution",

    crisisHeadline: "Guests now decide based on Google reviews — especially tourists or first-time visitors.",
    crisisDescription: `If you're already doing well with your ratings, that’s no accident — it’s a strategic move. In that case, you’re going to love Review-to-Revenue, because it <span class="font-semibold text-[#4FC3F7]">automates your process</span> and <span class="font-semibold text-[#4FC3F7]">multiplies your results</span>.<br/>
    <span class="block mt-2">Soon, I’ll show you <span class="font-semibold">3 revenue-boosting abilities</span> our system can deliver.</span><br/><br/>
    If your average Google rating is 4.5 or lower, it’s time to face the cold truth. If your competitor two blocks away is sitting at 4.8, here’s how the math looks in your guests’ minds:<br/>
    <span class="font-semibold">4.8 stars always beats 4.5 (or less).</span><br/>
    <span class="block mt-2">Every. Single. Time.</span><br/>
    A venue loses around 3–5 customers a day just because of review differences. <span class="italic text-gray-700">(The same goes for hotels, salons, yoga studios, etc.)</span><br/>
    <span class="block text-lg font-semibold text-red-600 mt-2">‼️ That’s roughly R100,000 in monthly losses. ‼️</span>`,
    crisisSolution: `We’ve got a <span class="font-semibold text-[#4FC3F7]">ridiculously simple system</span> that gets that money back — for the price of two pizzas.`,
    crisisCta: "Show me the solution!",

    // New text additions
    noCreditCardRequired: "No credit card required. No commitment. Just results.",
    rightAfterPayment: "After paying, your guest smiles with satisfaction, holding their phone. <strong>They're ready to tell the world how amazing their experience was with you.</strong> If you miss this magical moment, it’ll be much harder to get them to do it later.",
    awkwardReviewRequest: "💡 <strong>Take advantage of that momentum</strong>—right when your guest has just had a great experience. But how do you get them to do you this little favor?",
    awkwardReviewRequest_2: "There’s a <strong>brilliantly simple solution that makes people actually love leaving a review.</strong>",
    
    // micro-CTA in problem block
    startTrialCta: "Start my 14-day trial →",

    // CTA texts
    startFreeTrial: "Start free trial",
    comparePlans: "Compare all plans →",

    // Pricing Section
    pricing: {
      solo: "Solo",
      growth: "Growth",
      unlimited: "Unlimited",
      perMonth: "/mo",
      soloBullet: "Up to 200 reviews",
      growthBullet: "Up to 1 000 reviews",
      unlimitedBullet: "Everything, unlimited",
      bestValue: "Best Value",
      redirectingToStripe: 'Redirecting to Stripe...',
    },

    // Description text for steps
    scanDescription: "Customer scans your custom QR code during that perfect moment—when satisfaction is at its peak and they're actually excited about what you delivered",
    leaveReviewDescription: "They share their genuine experience where it matters most—on Google—or provide private feedback that helps you improve without damaging your online reputation",
    spinRedeemDescription: "The magic moment: they instantly spin our digital Wheel of Fortune and win a real prize that doesn't just make them smile—it brings them back through your doors",

    // Steps titles
    steps: {
      scanTitle: "1 · Scan",
      leaveReviewTitle: "2 · Leave Review",
      spinRedeemTitle: "3 · Spin & Redeem"
    },
    starsAndRevenueTagline: "Meanwhile, you happily watch stars — and revenue — pile up. 💸",

    // Other landing page section translations
    problemSolutionTitle: "74 % of customers ignore reviews older than one month.",
    howItWorksTitle: "THE GAME THAT CHANGES EVERYTHING",
    coreBenefits: {
      skyHighStarRating: "Sky-high star rating",
      captureAuthenticFeedback: "Capture authentic feedback when satisfaction is highest",
      privateNegativeFeedback: "Email collection",
      addressConcerns: "The guest left a review, won, and instantly shared their email. A perfect moment to send exclusive offers.",
      moreRepeatVisits: "More repeat visits",
      turnOneTimeVisitors: "Turn one-time visitors into loyal, repeat customers",
      // Keep the existing simplified keys for backward compatibility
      starRating: "Sky-high star rating",
      privateFeedback: "Private negative feedback",
      repeatVisits: "More repeat visits",
    },
    statsTitle: "+300 % reviews · +22 % repeat revenue",
    statsDescription: "Pilot venues averaged 87 new reviews monthly and a 22 % uptick in return spend.",
    trustedByTitle: "WHO IS Review-to-Revenue FOR?",
    restaurantsTitle: "Restaurants",
    barbershopsTitle: "Barbershops",
    cafesTitle: "Cafés",
    hotelsTitle: "Hotels",
    retailTitle: "Retail",
    salonsTitle: "Salons",
    trustedByMore: "Gyms, bistros, bakeries, beer bars, breakfast places, salad bars, flower shops, car mechanics, massage therapists, and more.",
    testimonialsTitle: "What Our Customers Say",
    pricingTeaserTitle: "Boost your revenue for the price of two pizzas",
    moreReviewsFlow: "More reviews ➡️ more guests ➡️ more revenue – Try it now!",
    differentiatorTitle: "Gamified Reviews Beat Traditional Requests — Every Time",
    differentiatorDescription: "Traditional review requests fail because they're easy to ignore, feel impersonal, and offer customers no real incentive. Flyers get tossed, emails get deleted, and your potential 5-star reviews vanish.",
    engagementTitle: "47% More Engagement",
    engagementDescription: "Gamification turns review requests into exciting, rewarding experiences customers actively seek out—leading to nearly double the participation.",
    revenueTitle: "32% Higher Revenue",
    revenueDescription: "Businesses with robust, fresh Google reviews earn substantially more revenue—because customers trust highly rated brands.",
    ignoreReviewsTitle: "74% ignore reviews older than one month.",
    ignoreReviewsDescription: "Most customers skip over reviews older than a month—making it vital to constantly collect fresh feedback that reflects your current excellence.",
    marketingChannelDescription: "Turn satisfied guests into your strongest marketing channel—with reviews that multiply your revenue.",

    // Final CTA Section
    finalCtaTitle: "Ready to grow your reviews & revenue?",
    finalCtaDescription: "Start collecting 5-star reviews in minutes with a game your customers love.",
    finalCtaButton: "Play Now → 50 % Off 3 Months",

    // Testimonials
    testimonials: {
      review1: "We collected 102 Google reviews in our first month – guests beg to spin the wheel!",
      review2: "Went from 4.2★ to 4.6★ in eight weeks. Bookings are up and staff love the game.",
      review3: "Guests won't leave the lobby until they spin. 29 % more repeat stays already.",
      name1: "Koloni Restaurant",
      name2: "Bali Babe Salon",
      name3: "YOU Suite Seminyak"
    },

    trustedBySectionHeadline: "Who is Review-to-Revenue for?",
    trustedByCards: [
      "<strong>Just opened and 'invisible' on Google</strong><br/>Your place looks great, food's amazing – but without at least 20–30 reviews, tourists just walk by. Getting those first 100 fast = survival.",
      "<strong>Been around for years, but loyal guests are fading</strong><br/>Nostalgia isn’t enough anymore. If your last reviews are from 4 years ago, it feels like you haven’t had guests in 4 years. You need fresh ones to build trust again.",
      "<strong>A trendy, ‘Instagrammable’ spot opened nearby</strong><br/>They're posting everywhere, running Google Ads, going viral. You’ve got happy guests – they just haven’t shared. A targeted review campaign puts you back in the race.",
      "<strong>Your Booking/Google rating dropped below 4.5 – and so did your income</strong><br/>A few bad days, critical guests, and bookings vanish. Dozens of new, positive reviews can pull your average back up – a crucial factor for many customers.",
      "<strong>You prioritize quality, but can’t spend more on marketing</strong><br/>Google Ads are expensive, organic reach is dead. Review-to-Revenue helps you activate happy guests for pennies – they become your most authentic, free marketers."
    ],    
    trustedBySectionClosing: "Today, reviews are currency. Don’t let your competitors harvest the voices of your satisfied guests!",
    revenueBoostHeadline: "Review-to-Revenue helps them boost their revenue:",

    // Navigation
    nav: {
      useCases: "Use Cases",
      pricing: "Pricing",
      contact: "Contact",
      signIn: "Sign In"
    },

    pricingPlans: {
      solo: {
        name: "Starter",
        period: "/month",
        buttonText: "Get Started",
        features: [
          "1 business",
          "Up to 3 Wheel of Fortunes",
          "Max. 200 new reviews/month",
          "Downloadable guest email list",
          "Short video tutorials",
          "Access to your own stats"
        ]
      },
      growth: {
        name: "Growth",
        period: "/month",
        buttonText: "I’ll choose this",
        features: [
          "Everything in Starter",
          "Up to 3 businesses",
          "Up to 15 Wheel of Fortunes",
          "Max. 1000 new reviews/month",
          "Custom design"
        ],
        badge: "Most popular"
      },
      unlimited: {
        name: "Professional",
        period: "/month",
        buttonText: "Let’s go!",
        features: [
          "Everything in Growth",
          "Unlimited businesses",
          "Unlimited new reviews/month",
          "Unlimited Wheel of Fortunes",
          "Fast support – replies within 2 hours",
          "Feature requests",
          "Personalized onboarding"
        ],
        badge: "All inclusive"
      }
    },    


    // New additions for trial and pricing
    daysLeftInTrial: "{days} days left in your trial",
    choosePlanAfterTrial: "Choose a plan to continue using all features after your trial ends.",
    choosePerfectPlan: "Choose the perfect plan for your business",
    freeTrialBanner: "Start your 14-day free trial — no credit card required!",
    freeTrialShortLine: "Start your 14-day free trial — no credit card required!",
    currentPlan: "Current Plan",
    monthly: "Monthly",
    yearly: "Yearly",
    save20Percent: "Save 20%",
    getStarted: "Get Started",

    // Challenge Landingpage
    challengeHeadline: "[FREE]<br class='block sm:hidden' /> 5-DAY REVENUE BOOST CHALLENGE FOR HOSPITALITY<wbr />VENUES",
    challengeSubline: "Boost your traffic on a small budget – and rediscover the pride that made you start this journey!",
    challengeQuestion: "<h2 class='text-2xl sm:text-3xl font-bold mb-6'>Ever closed up at night and wondered: is this really worth it? So much work… for so little profit?</h2>",
    challengeMarketingBoost: "Many people feel this way right now.<br />But you're not alone, and you don’t have to give up on your dream.<br /><strong>This free email series is for you if you want to give your hospitality business a new push</strong> — and you're open to a few dead-simple but powerful marketing tricks you can apply today — <strong>for less than $25</strong>.",
    challengeCtaButton: "Send me the tips!",
    challengeSubheadline: "5 Revenue-Boosting Marketing Tips for Hospitality Owners — Under $25",

    challengeWhatYouGetTitle: "What do you get if you join the challenge?",
    challengeTip1Title: "Simple but effective tips",
    challengeTip1Desc: "You don't need to be a marketer. These tips are designed so you can <strong>implement them solo</strong> – even if you have zero time or energy to plan new campaigns or ads. Everything is easy to follow and quick to apply.",
    challengeTip2Title: "Practical guides",
    challengeTip2Desc: "We tell you exactly what to do. What to post on Facebook, where to put your QR code, what to say to guests. Not just inspiration – but <strong>real, actionable steps that work, even with just 15 minutes a day</strong>.",
    challengeTip3Title: "Strategies that actually drive revenue",
    challengeTip3Desc: "These tips don't just make your place 'more visible' – they bring in more guests. <strong>More orders, more regulars</strong> – and finally, the feeling that it's all worth it.",
    challengeTip4_1Title: "Hospitality-specific ideas",
    challengeTip4_2Title: "Accommodation-specific ideas",
    challengeTip4_1Desc: "Each of the 5 emails includes <strong>tailored tips for the hospitality industry</strong>. We designed them specifically for the needs of small and medium-sized businesses, so you can be sure that <strong>you’ll be able to apply every single one</strong>.",
    challengeTip4_2Desc: "Each of the 5 emails includes <strong>tailored tips for the accommodation industry</strong>. We designed them specifically for the needs of small and medium-sized hosts, so you can be sure that <strong>you’ll be able to apply every single one</strong>.",
    challengeTip5Title: "Budget-friendly tools",
    challengeTip5Desc: "We know marketing budgets are tight for accommodation businesses. That’s why <strong>every suggestion costs you no more than 10,000 HUF per month</strong> – and each of them will generate several times that amount in extra revenue.",    
    
    challengeWhoTitle: "It's for you if…",
    challengeWho1: "you run a café, bistro, breakfast spot, wine bar, pub, restaurant, or bakery – and want new guests without spending on ads.",
    challengeWho2: "you're not a marketer but want to learn a few simple tricks that bring in more money.",
    challengeWho3: "you're tired of working hard with little to show for it – and ready for a way out.",

    challengeWhyTitle: "Why is it worth joining the challenge?",
    challengeWhy1: "✅ Because these aren't theory – they're <strong>real-world methods that many venues are already using successfully</strong>.",
    challengeWhy2: "✅ Because we believe <strong>small venues deserve to communicate like the big chains</strong>.",
    challengeWhy3: "✅ And because <strong>sometimes, one small change is all it takes to spark something new</strong>.",

    challengeSignupTitle: "📬 Get your free revenue-boosting tips now!",
    challengeSignupSubline: "Drop your email and we'll send the first tip right away – featuring the cheapest, most effective strategy that's already changed many hospitality businesses.",
    challengeCtaButton: "Send me the 5 marketing tips!",

    // Challenge Landingpage for Hosts
challengeHeadline_2: "[FREE]<br class='block sm:hidden' /> 5-DAY REVENUE BOOST CHALLENGE FOR HOSTS-<wbr />",
challengeQuestion_2: "<h2 class='text-2xl sm:text-3xl font-bold mb-6'>Have you ever reached the end of a long season and thought: is all this effort really worth it for such little profit?</h2>",
challengeMarketingBoost_2: "You're not alone.<br />But you don’t have to give up on your dream.<br /><strong>This free email series is for you if you're ready to breathe new life into your rental</strong> with a few ridiculously simple but powerful marketing tricks you can start using today.",
challengeSubheadline_2: "5 low-cost marketing hacks to grow your rental revenue under $30",
challengeWho1_2: "you run a guesthouse / apartment / B&B / countryside lodge / Airbnb and want to attract more guests – without spending on ads.",
challengeWhy1_2: "✅ Because these aren’t just theories – they’re <strong>proven tactics used successfully by countless hosts</strong>.",
challengeSignupSubline_2: "Drop your email and we’ll send the first tip straight to your inbox – featuring the cheapest, most effective trick that’s changed the game for many hosts.",

// Challenge Landingpage for Beauty Professionals
challengeHeadline_3: "[FREE]<br class='block sm:hidden' /> 5-DAY REVENUE BOOST CHALLENGE FOR BEAUTY PROS-<wbr />",
challengeQuestion_3: "<h2 class='text-2xl sm:text-3xl font-bold mb-6'>Ever had one of those days where you think: is all this really worth it for so little profit?</h2>",
challengeMarketingBoost_3: "You’re not alone.<br />But you don’t have to give up on your dream.<br /><strong>This free email series is for you if you're ready to bring fresh energy to your salon or services</strong> with a few ridiculously simple but powerful marketing tricks you can start using today – <strong>for under $30</strong>.",
challengeSubheadline_3: "5 low-cost marketing tips for beauty professionals under $30",
challengeWho1_3: "you’re a hairdresser, barber, masseuse, nail tech, or do any kind of beauty treatments – and want more clients without spending on ads.",
challengeWhy1_3: "✅ Because these aren’t just theories – they’re <strong>real tactics already used by countless beauty pros</strong>.",
challengeSignupSubline_3: "Drop your email and we’ll send your first tip – featuring the cheapest, most effective trick that’s helped many beauty businesses grow. You’ve got nothing to lose – except another empty appointment slot.",

    // Info blocks
    infoBlock1Headline: "DID YOU KNOW?",
    infoBlock1Body: "➡️ 92% of shoppers read online reviews before making a purchase (PowerReviews 2023, Trustmary 2025)",

    infoBlock2Headline: "Fresh reviews matter even more",
    infoBlock2Body: "➡️ 88% of shoppers trust reviews as much as personal recommendations (WiserNotify 2025)",

    infoBlock3Body: "➡️ 72% of customers feel more confident in a provider after reading positive reviews (WiserNotify 2025)",

    infoBlockFinalCta: "The businesses that stay afloat and grow their revenue are the ones that consistently collect positive customer feedback.",

    // ---------- Pain-points block ----------
    problemsBlockHeadline: "3 problems draining your profits:",
    
    problems1Title: "The silent majority of customers",
    problems1Bullet1: "95% of your happy customers leave without sharing their experience",
    problems1Bullet2: "Their positive stories never reach future buyers",
    problems1Bullet3: "Word-of-mouth referrals remain stuck in private conversations",
    
    problems2Title: "The Google invisibility crisis",
    problems2Bullet1: "Your business looks less trustworthy than competitors with more reviews",
    problems2Bullet2: "Lower Google ranking means fewer people find you",
    problems2Bullet3: "Potential customers choose rivals based on review count and rating",
    
    problems3Title: "Losing repeat customers",
    problems3Bullet1: "No regular touch-point with already satisfied clients",
    problems3Bullet2: "Missed referrals and repeat purchases",
    problems3Bullet3: "Unable to increase lifetime value of existing customers",

    // ---------- Cost of Inaction block ----------
    inactionBlockHeadline: "THE COST OF INACTION",
    inactionBullet1: "<strong>Lost customers:</strong> Every day without reviews sends potential buyers to your competitors",
    inactionBullet2: "<strong>Shrinking price flexibility:</strong> Consistent positive reviews are essential if you want to charge premium prices",
    inactionBullet3: "<strong>Missed growth:</strong> Leveling up is tough without credible customer feedback",    

    // Transition Question Block
    transitionQuestionHeadline: "Would you also like to boost your revenue with a steady stream of fresh, positive Google reviews?",

    // New content block
    newBlockDescription: `<h2 class='text-2xl sm:text-3xl font-semibold text-gray-900 mb-2'>All you need to do is <strong class='font-semibold'>mobilize your guests</strong> once and for all.</h2>`,
    newBlockDescriptionExtended: `<h2 class='text-2xl sm:text-3xl font-semibold text-gray-900 mb-2'>With <strong class='font-semibold'>Review-to-Revenue</strong>, your <strong class='font-semibold'>best guests</strong> become <strong class='font-semibold'>enthusiastic reviewers</strong> in just 30 seconds.</h2><br>No begging, no awkward conversations – just a <strong class='font-semibold'>QR code they love to use</strong>, because after writing a Google Review, they <strong class='font-semibold'>spin a digital prize wheel</strong> and <strong class='font-semibold'>always win something</strong>. These are <strong class='font-semibold'>valuable rewards for your guests</strong>, but <strong class='font-semibold'>low-cost for you</strong>, designed to <strong class='font-semibold'>bring them back again</strong>.`,
    newBlockNoNeedListTitle: "You don't need:",
    newBlockNoNeedList: [
      "❌ professionally produced videos costing hundreds of thousands of dollars,",
      "❌ expensive influencer collaborations,",
      "❌ to double your PPC campaign budget,",
      "❌ or post TikTok videos every day."
    ],
    newBlockFinalLine: "All you need to do is mobilize your guests at last.",
    revenueEngineHeadline: "This is how Review-to-Revenue makes you money",

    // Review-to-Revenue Intro Section
    r2rIntroHeadline: "This is Review-to-Revenue.",
    r2rIntroSubline: "A <strong>playful tool that lets you collect new customer reviews in a flash</strong>. This simple system helps you automatically collect more guest reviews – <strong>it's QR-based, mobile-friendly, and requires no downloads or apps</strong> for you or your guests. It's brilliant because every new review is a new chance to turn a stranger into a customer. <strong>The more fresh, positive reviews</strong> you have, the more people will <strong>choose you over your competitors</strong>.",
    
    r2rFeatures: [
      "✅ More fresh Google reviews – automatically\nNo more begging guests. The system does the work for you.",
      "✅ Stand out from the competition\nMore reviews = better rankings and more clicks on Google.",
      "✅ More guests without advertising\nGreat reviews are the cheapest and most credible ads.",
      "✅ Set it up in minutes – no tech skills needed\nSimple, fast, user-friendly – anyone can do it.",
      "✅ Filter out negative reviews\nLess-than-great feedback stays private and helps you improve without damaging your reputation.",
      "✅ Collect valuable email addresses\nWith one extra click, guests can subscribe to your newsletter and stay in touch.",
      "✅ All of this for the price of 10 coffees a month\nJust $29/month for the most powerful tool to beat your competition."
    ],

    r2rHowToUseTitle: "How Review-to-Revenue works",
    r2rHowToUseIntro1: "After paying, your guest is smiling, holding their phone, ready to tell the world how <strong class='font-semibold'>great their experience</strong> was. If you miss this magic moment, it'll be much harder to get them to leave a review later.",
    r2rHowToUseIntro2: `After payment, your guest is happy – that’s the <strong class='font-semibold'>perfect moment</strong> to ask for a review. Later, it’s much harder to convince them. 💡 Use this <strong class='font-semibold'>post-experience wow moment</strong> to your advantage! With Review-to-Revenue, you can <strong class='font-semibold'>ask for a Google review in a playful way</strong>:<br/><br/>
    🎯 Create a prize wheel,<br/>
    🎯 Add rewards and your Google link,<br/>
    🎯 Show the QR code to your guest at checkout.`,
    r2rHowToUseQuestion: `Ask: “<strong class='font-semibold'>Would you like to leave us a review for a chance to win a prize?</strong>” – and show them the QR code generated in Review-to-Revenue. From there, <strong class='font-semibold'>the system handles the rest automatically</strong>.`,
    r2rHowToUseSteps: [
      "The guest is having a great time with you,",
      "You invite them to leave a review for a chance to win — they happily say yes,",
      "They spin the Wheel of Fortune and win a small gift or discount,",
      "They write a <strong class='font-semibold'>positive review</strong> and feel even better,",
      "Then <strong class='font-semibold'>they gladly share their email address</strong>,",
      "Now you have a new 5-star review and a new subscriber."
    ],
    r2rHowToUseFootnote:
      "* Offer a <strong class='font-semibold'>high-value grand prize</strong>. For example: breakfast/lunch/dinner for two, an expensive bottle of wine, or a big discount. Set the win chance low - about 1-2%. This keeps the game highly attractive without hurting your margins.", 

    r2rGuestExperienceIntro: "How Review-to-Revenue works for your guests",
    r2rGuestExperienceHeadline: "That’s why the Review-to-Revenue method is crushing it:",
    gamifiedRequestHeadline: "The multiplying power of gamified reviews",
    gamifiedRequestText: "🎯 Fun experience → Far more guests leave a review (85% vs. 3% industry avg)<br/>🎁 Instant rewards → Instant satisfaction and loyalty<br/>📱 Mobile-first → Perfect for Gen Y and Gen Z’s phone-centric world<br/>🏆 Guaranteed prizes → Positive brand moment & word-of-mouth buzz<br/>🔁 Return-driving rewards → Direct revenue from repeat visits",
    engagementBoostHeadline: "",
    engagementBoostText: "The prize wheel turns review requests into a fun, rewarding experience that customers actively seek out—leading to nearly twice as much participation.",
    satisfiedGuestsToMarketing: "Turn satisfied guests into your strongest marketing channel – with reviews that multiply your revenue!",
    guestsScanPlayWin: "Guests scan the QR code, leave a review, spin the wheel, and return for their prize. All you need to do is count the new stars and the rising revenue.",

    // New revenue block keys
    revenueBlockHeadline: "3 + 1 revenue powers you unlock with Review-to-Revenue",
    rev1Title: "More Google reviews ⭐️⭐️⭐️⭐️⭐️",
    rev1Body: "When someone looks for a café, bakery or restaurant, they check Google Maps reviews first. <strong>A long list of fresh, positive ratings makes them choose you.</strong><br/><br/>You surface faster on Maps, rank higher in search, and outshine competitors still begging for reviews the old-fashioned way.",
    rev2Title: "Quality matters, not just quantity 💯",
    rev2Body: "A new waiter's bad day or a sloppy clean-up can drop a few 1-star bombs that scare customers away.🥴<br/><br/><strong>Review-to-Revenue helps your best guest experiences speak louder online.</strong> The more happy guests leave reviews, the less impact a few bad ones will have.",
    rev3Title: "Generate repeat visits ♻️",
    rev3Body: "Offer prizes redeemable on the next visit and you've kick-started the return cycle.<br/><br/><strong>A 10–15 % coupon that expires soon is a powerful nudge to come back.</strong>",
    rev4Title: "+1 Email collection – a gold mine 💸",
    rev4Body: "Guest is happy, leaves a review, wins – and enters their email. <strong>Perfect moment to invite them to exclusive offers.</strong><br/><br/>Our users see 30–40 % opt-in rates; elsewhere you'd pay $3-4 per subscriber. Here, they're practically free.",
    revenueBlockCta: "Start boosting revenue now!",

    ctaPrimary: "Get Started",
    ctaSecondary: "Get Started",
    ctaTertiary: "Get Started",
    ctaFooter: "Get Started",

    // New keys
    disclaimer: "Disclaimer",
    lowRatingThankYou: "Thank you for your feedback! 🙏",
    lowRatingAppreciation: "We appreciate your honest review. Let's make it up to you with a special reward!",
    lowRatingCta: "Spin the Prize Wheel",
    switchTabHint: "The review page opened in a new tab. Please switch tabs, leave your review, then return here to spin the wheel!",
    popupBlockedHint: "Your browser blocked opening a new window. Please allow pop-ups so we can take you to the Google review page!",

    // New review request keys
    reviewAskTitle: "Thanks for playing with us!",
    reviewAskCopy: "How was your experience at our place?<br/><strong>We'd love to hear from you</strong> – your feedback helps future customers and makes us better.",
    openGoogleReviews: "Leave a Google Review",

    setupStepsTitle: "Build your review-generating system in 5+1 steps",
    setupStepsSubtitle: "Do this once, then it runs on autopilot.",
    setupSteps: [
      "Click “Get Started” and create your business account and review page (3 minutes).",
      "Add 3–8 prizes and set win probabilities for your Wheel of Fortune (2 minutes).",
      "Download the QR code generated by the system (1 minute).",
      "Place the QR code on your menu/flyer/table tent/sticker. TIP: show the grand prize and add this question: “Would you rate us for a chance to win?” (5 minutes).",
      "Print it yourself or send it to a print shop (5 minutes + printing time).",
      "Place the QR where it’s highly visible, e.g., on tables, at the cashier, in the restroom (+1, 5 minutes)."
    ],
    setupStepsOutro:
      "From here, simply point satisfied guests to the QR. The system runs automatically and brings you extra stars and revenue month after month.",
    ltd: {
      barText: "Founding Member Lifetime is available now. Prices rise next month.",
      barCta: "Grab it",
      countdownLabel: "Ends this month in {countdown}",
      badge: "Lifetime",
      title: "Founding Member",
      subtitle: "Pay once. Use forever.",
      priceNote: "one-time for 1 business",
      features: {
        wheels: "Up to 3 Wheel of Fortunes",
        reviews: "200 new reviews/month",
        emails: "Download guest emails",
        tutorials: "Short video tutorials",
        stats: "Your own stats dashboard",
        updates: "All future updates"
      },
      addExtraLabel: "Add extra business",
      each: "+{price} each",
      totalLabel: "Total",
      cta: "Get Founding Member Lifetime",
      redirecting: "Redirecting…"
    }

  },
  hu: {
    // Review page
    reviewHeadline: "Pörgess és nyerj!",
    reviewHeadlineShort: "Írj értékelést és nyerj!",
    standachance: "Akár nyerhetsz:",
    reviewThanks: "🎉 Köszönjük az értékelést! Most megpörgetheted a szerencsekereket!",
    tapToRate: "Érintsd meg a csillagokat értékeléshez",
    leaveReview: "Google Értékelés Írása",
    spinWheel: "Pörgesd meg a kereket",
    spinning: "Pörög...",
    congratulations: "Gratulálunk!",
    youWon: "Nyereményed:",
    getReward: "Nyereményem átvétele",
    emailPlaceholder: "email@pelda.hu",
    emailPrivacy: "Az email címedet csak a nyeremény elküldéséhez használjuk fel.",
    emailMarketingOptIn: "Szeretnék értesülni a(z) {business_name} jövőbeni promócióiról és kedvezményeiről, és elfogadom az <a href='/privacy' target='_blank' class='underline text-blue-600'>adatkezelési tájékoztatót</a>.",
    sending: "Küldés...",
    successMessage: "A nyereményed elküldtük emailben!<br><strong>Kérjük, ellenőrizd a Spam/Promóciók mappát is.</strong>",
    redirectingNotice: "Megnyitjuk a Google-értékelő oldalt egy új lapon. <strong>Miután leadtad az értékelésed, zárd be az új fület, és térj vissza ide, hogy megpörgethesd a kereket és átvehesd a nyereményed!</strong> 🎁",
    emailAlreadyUsed: "Ezzel az e-mail címmel már részt vettél a sorsoláson.",
    genericSaveError: "Hiba történt az adatok mentésekor. Kérlek, próbáld újra.",

        // Email template
    emailSubject: "A nyereményed a(z) {businessName}-től készen áll 🎁",
    emailGreeting: "Szia!",
    emailThanks: "Köszönjük, hogy a {businessName} vendége voltál 🙌",
    emailWinMessage: "Megpörgetted a szerencsekereket és nyertél",
    emailImportant: "Fontos:",
    emailQrOneTime: "A QR kód csak egyszer használható",
    emailQrExpires: "Érvényességi idő:",
    emailQrTitle: "🎁 A nyereményed QR kódja:",
    emailQrInstructions: "Mutasd ezt a QR kódot a személyzetnek a nyeremény beváltásához",
    emailQrBackupLinkText: "QR-kód probléma? Nyisd meg itt",
    emailClosing: "Reméljük, örömet szerzünk ezzel a kis meglepetéssel!",
    emailSignature: "Üdvözlettel,",
    emailTeam: "A(z) {businessName} csapata",
    emailPS: "UI: Ismersz olyat, akinek segítene több Google-értékelést gyűjteni és bevétellé alakítani?",
    emailPSLinkText: "👉 Próbáld ki a Review to Revenue-t – egyszerű, hatékony, és kifejezetten helyi vállalkozásoknak készült 🚀",
      downloadYourPrize: "Nyeremény letöltése",

    // QR redeem page
    redeemTitle: "Nyereményed",
    you_won_title: '🎁 Gratulálunk, nyertél:',
    rewardExpired: "Ez a nyeremény lejárt",
    rewardRedeemed: "Ezt a nyereményt már beváltották",
    use_coupon_label: 'Használd ezt a kuponkódot a fizetésnél:',
    redeemButton: "Nyeremény beváltása",
    redeeming: "Beváltás...",
    expiresOn: "Érvényes eddig:",

    // Wheel preview additions
    availablePrizes: "Elérhető nyeremények",
    previewOfGuests: "Így fog kinézni a vendégeknek",
    editProject: "Projekt szerkesztése",
    backToProjects: "Vissza a projektekhez",

    // Review timing section - NEW
    reviewTimingParagraph: "Fizetés után a vendéged mosolyog, a telefonja a kezében. Készen áll, hogy elmondja a világnak, mennyire jól érezte magát. Ha elmulasztod ezt a pillanatot, később már sokkal nehezebb őket motiválni erre. Ahelyett, hogy napokkal később kérnél értékelést (ha egyáltalán eszedbe jut a napi mókuskerékben), adj nekik egy 60 másodperces játékot, amivel szívesen játszanak. Ők kapnak egy jutalmat, te pedig egy friss Google értékelést: mindenki nyer.",
    reviewTimingHeadline: "Az elégedett vendégeket alakítsd át a legerősebb marketing csatornáddá – értékelésekkel, amelyek megsokszorozzák a bevételeidet!",

    // Landing page
    landingHeroHeadline: "VÉLEMÉNYBŐL BEVÉTEL",
    landingHeroSubline: `A Google Review az első benyomás rólad online – és a vendégek mindig azt választják, ahol több és jobb értékelést látnak. Hozz létre egy virtuális szerencsekereket velünk, és zsebelj be <span class="text-[#4FC3F7] font-semibold">7–9-szer több ötcsillagos véleményt</span>. Így vonzóbb leszel az új vendégek szemében, a nyeremények visszahozzák őket, és <span class="font-semibold">32%-uk</span> még e-mail címet is ad.<br><span class="block text-sm sm:text-base mt-2 text-gray-600"><em>Nézd meg, mennyi plusz bevételt hozhat ez neked!</em></span>`,
    landingHeroCta: "Mutasd a kalkulátort",    

    crisisHeadline: "A vendégek ma már Google-vélemények alapján döntenek, főleg ha turisták vagy először járnak a környéken.",
    crisisDescription: `Ha te már jól állsz a csillagok gyűjtésében, akkor ez nem a véletlen műve, hanem tudatos stratégia. Ez esetben imádni fogod a Review-to-Revenue-t, mert <span class="font-semibold text-[#4FC3F7]">automatizálja folyamataid</span> és <span class="font-semibold text-[#4FC3F7]">sokszorosára növeli az eredményeid</span>.<br/>
    <span class="block mt-2">Hamarosan mutatok <span class="font-semibold">3 bevételtermelő képességet</span>, amit a rendszerünk tud neked nyújtani.</span><br/><br/>
    Ha 4.5 vagy az alatti az átlagod a GoogleMaps-en, akkor jobb, ha szembenézel a húsbavágó valósággal. Ha a konkurenciád két sarokkal odébb 4.8-an áll, akkor így néz ki a vendégek fejében a matek:<br/>
    <span class="font-semibold">A 4.8 csillag mindig legyőzi a 4.5-öt (vagy az alattiakat).</span><br/>
    <span class="block mt-2">Minden. Egyes. Alkalommal.</span><br/>
    Egy vendéglátóhely naponta nagyjából 3–5 vevőt veszít el csak az értékelési különbség miatt. <span class="italic text-gray-700">(De a szállásadók, szépségszalonok, jógastúdiók, stb. is hasonló arányban esnek el bevételtől.)</span><br/>
    <span class="block text-lg font-semibold text-red-600 mt-2">‼️ Ez nagyjából 1 millió Ft veszteség havonta. ‼️</span>`,
    crisisSolution: `Van egy <span class="font-semibold text-[#4FC3F7]">pofonegyszerű rendszerünk</span>, ami két pizza áráért visszaszerzi neked ezt a pénzt.`,    
    crisisCta: "Mutasd a megoldást!",

    // New text additions
    noCreditCardRequired: "Nem kell bankkártya. Nincs elköteleződés. Csak eredmények.",
    rightAfterPayment: "Fizetés után a vendéged elégedetten mosolyog, a kezében a telefonja. <strong>Készen áll, hogy elmondja a világnak, mennyire nagyszerűen érezte magát nálad.</strong>  Ha elmulasztod ezt a varázslatos pillanatot, később már sokkal nehezebb lesz őt rávenni erre.",
    awkwardReviewRequest: "💡 <strong>Használd ki a momentumot</strong>, amikor a vendéged épp átélte a szuper élményt. De hogyan vedd rá őt erre a szívességre?",
    awkwardReviewRequest_2: "Létezik egy <strong>pofonegyszerű megoldás, amivel az emberek imádnak véleményt írni.</strong>",    

    // micro-CTA in problem block
    startTrialCta: "Kezdd el a 14 napos próbaidőt →",

    // CTA texts
    startFreeTrial: "Kezdd el az ingyenes próbát",
    comparePlans: "Összes csomag összehasonlítása →",

    // Pricing Section
    pricing: {
      solo: "Alap",
      growth: "Növekedés",
      unlimited: "Korlátlan",
      perMonth: "/hó",
      soloBullet: "200 értékelésig",
      growthBullet: "1 000 értékelésig",
      unlimitedBullet: "Minden, korlátlanul",
      bestValue: "Legjobb ajánlat",
      redirectingToStripe: 'Átirányítás a Stripe fizetéshez...',
    },

    // Description text for steps
    scanDescription: "A vendég beszkenneli az egyedi QR-kódodat a tökéletes pillanatban—amikor a legnagyobb az elégedettség és valóban lelkesek attól, amit kaptak",
    leaveReviewDescription: "Megosztják valódi élményüket ott, ahol számít—a Google-on—vagy privát visszajelzést adnak, amely segít neked fejlődni anélkül, hogy rontaná az online hírnevedet",
    spinRedeemDescription: "A varázslatos pillanat: azonnal megpörgetik a digitális szerencsekereket, és nyernek egy valódi nyereményt, ami nemcsak mosolyt csal az arcukra—hanem visszahozza őket az ajtódon",

    // Steps titles
    steps: {
      scanTitle: "1 · Beolvasás",
      leaveReviewTitle: "2 · Értékelés",
      spinRedeemTitle: "3 · Pörgetés és beváltás"
    },
    starsAndRevenueTagline: "Te pedig csak elégedetten számolod a szaporodó csillagokat és bevételt. 💸",

    // Other landing page section translations
    problemSolutionTitle: "A vendégek 74%-a figyelmen kívül hagyja az egy hónapnál régebbi értékeléseket.",
    howItWorksTitle: "A JÁTÉK, AMI MINDENT MEGVÁLTOZTAT",
    coreBenefits: {
      skyHighStarRating: "Magasba szökő csillagértékelés",
      captureAuthenticFeedback: "Valódi visszajelzéseket gyűjteni a legnagyobb elégedettség mellett",
      privateNegativeFeedback: "E-mail gyűjtés",
      addressConcerns: "A vendég értékelt, nyert, és máris megadta az e-mail-címét. Tökéletes alkalom, hogy exkluzív ajánlatokat küldj.",
      moreRepeatVisits: "Több visszatérő látogató",
      turnOneTimeVisitors: "Fordítsd a látogatókat hűséges, visszatérő vendégekké",
      // Keep the existing simplified keys for backward compatibility
      starRating: "Magasba szökő csillagértékelés",
      privateFeedback: "Privát negatív visszajelzések",
      repeatVisits: "Több visszatérő vendég",
    },
    statsTitle: "+300% értékelés · +22% ismételt bevétel",
    statsDescription: "A teszthelyeken átlagosan havi 87 új értékelés és 22%-os növekedés volt a visszatérő költésekben.",
    trustedByTitle: "KINEK VALÓ a Review-toRevenue?",
    restaurantsTitle: "Éttermek",
    barbershopsTitle: "Fodrászszalonok",
    cafesTitle: "Kávézók",
    hotelsTitle: "Szállodák",
    retailTitle: "Kiskereskedelem",
    salonsTitle: "Szépségszalonok",
    trustedByMore: "Konditermek, bisztrók, pékségek, sörházak, reggelizők, salátabárok, virágboltok, autószerelők, masszőrök, stb.",
    testimonialsTitle: "Ügyfelek véleménye",
    moreReviewsFlow: "Több értékelés ➡️ több vendég ➡️ több bevétel – Próbáld ki!",
    pricingTeaserTitle: "Bevételnövelés már két pizza áráért",
    differentiatorTitle: "A gamifikált értékelések minden esetben felülmúlják a hagyományos kéréseket",
    differentiatorDescription: "A hagyományos értékelési kérések azért nem működnek, mert könnyen figyelmen kívül hagyják őket, személytelenek, és nem kínálnak igazi ösztönzőt az ügyfeleknek. A szórólapok elvésznek, az e-mailek törlődnek, és a potenciális 5 csillagos értékelések eltűnnek.",
    engagementTitle: "47%-kal több elköteleződés",
    engagementDescription: "A gamifikálás izgalmas, jutalmazó élménnyé alakítja az értékelési kéréseket, amelyeket az ügyfelek aktívan keresnek, így szinte kétszer annyi részvételt eredményez.",
    revenueTitle: "32%-kal magasabb bevétel",
    revenueDescription: "Azok a vállalkozások, amelyek friss, erős Google értékelésekkel rendelkeznek, lényegesen magasabb bevételt keresnek, mert az ügyfelek jobban bíznak a magas értékelésű márkákban.",
    ignoreReviewsTitle: "74%-uk figyelmen kívül hagyja az egy hónapnál régebbi értékeléseket.",
    ignoreReviewsDescription: "A legtöbb ügyfél kihagyja az egy hónapnál régebbi értékeléseket, ezért fontos, hogy folyamatosan gyűjtsünk friss visszajelzéseket, amelyek tükrözik a jelenlegi kiválóságot.",
    marketingChannelDescription: "A kielégített vendégeket alakítsd át a legerősebb marketingcsatornává — értékelésekkel, amelyek megsokszorozzák a bevételeidet.",

    // Final CTA Section
    finalCtaTitle: "Készen állsz több értékelésre és bevételre?",
    finalCtaDescription: "Kezdj el 5 csillagos értékeléseket gyűjteni perceken belül egy játékkal, amit az ügyfeleid imádni fognak.",
    finalCtaButton: "Játssz most → 50% kedvezmény 3 hónapra",

    // Testimonials
    testimonials: {
      review1: "Az első hónapban 102 Google értékelést gyűjtöttünk – a vendégek könyörögnek, hogy pörgethessenek!",
      review2: "4.2★-ról 4.6★-ra emelkedtünk nyolc hét alatt. Több foglalás és a személyzet is imádja a játékot.",
      review3: "A vendégek nem hajlandók elhagyni a lobbyt, míg nem pörgetnek. Máris 29%-kal több visszatérő vendég.",
      name1: "Koloni Étterem",
      name2: "Bali Babe Szalon",
      name3: "YOU Suite Seminyak"
    },

    trustedBySectionHeadline: "Kinek való a Review-to-Revenue?",
    trustedByCards: [
      "<strong>Most nyitottál, és „láthatatlan” vagy a Google-ben</strong><br/>Új a helyed, minden szép, a kaja is szuper – de ha nincs legalább 20-30 értékelésed, a turisták simán elsétálnak melletted. Az első 100 véleményt gyorsan összegyűjteni = túlélés kérdése.",
      "<strong>Régi motoros vagy, de fogy a törzsvendég, újak meg nem jönnek</strong><br/>A nosztalgia már nem elég. Ha a vendégek 4 éve írták az utolsó dicséretet, az olyan, mintha 4 éve nem is lett volna vendéged. Friss visszajelzések kellenek, hogy bizalmat építs az újaknál.",
      "<strong>Rád nyitott egy új, „instakompatibilis” hely a sarkon</strong><br/>Ők teleposztolják magukat, fizetett Google Ads, TikTok, minden. Neked viszont ott a sok elégedett vendéged – csak még nem meséltek rólad. Egy jól célzott értékelésgyűjtő kampány simán visszahozhat a versenybe.",
      "<strong>A Booking/Google értékelésed lecsúszott 4.5 alá, és megérezte a pénztárgép is</strong><br/>Egy-két rossz nap, pár kritikus vendég, és máris elpárolognak a foglalások. Pár tucat friss, pozitív értékelés segít visszahozni az átlagszámot, ami bizony sok vendégnek döntő szempont.",
      "<strong>Mindent a minőségre raksz, de nem tudsz többet költeni marketingre</strong><br/>Drága a Google hirdetés, a social organikus elérése nulla. A Review to Revenue viszont fillérekért segít vendégeket mozgósítani – ők pedig helyetted csinálják a marketinget, hitelesen és ingyen."
    ],    
    trustedBySectionClosing: "A vélemény ma már valuta. Ne hagyd, hogy a konkurencia besöpörje a te elégedett vendégeid véleményét is!",
    revenueBoostHeadline: "A Review-to-Revenue nekik növeli a bevételt:",

    // Navigation
    nav: {
      useCases: "Megoldások",
      pricing: "Árazás",
      contact: "Kapcsolat",
      signIn: "Bejelentkezés"
    },

    pricingPlans: {
      solo: {
        name: "Kezdő",
        period: "/hó",
        buttonText: "Regisztrálok",
        features: [
          "Egy üzlet kezelése",
          "Max. 3 szerencsekerék",
          "Havonta max. 200 új értékelés",
          "Letölthető vendég e-mail lista",
          "Rövid, videós útmutatók",
          "Magyar nyelvű ügyfélszolgálat – 24 órán belüli válaszadással",
          "Saját statisztikák elérése",
        ]
      },
      growth: {
        name: "Fejlődő",
        period: "/hó",
        buttonText: "Ezt választom",
        features: [
          "Minden a Kezdő csomagból",
          "Max. 3 üzlet kezelése",
          "Max. 15 szerencsekerék",
          "Havonta max. 1000 új értékelés",
          "Egyedi design",
        ],
        badge: "Népszerű választás"
      },
      unlimited: {
        name: "Professzionális",
        period: "/hó",
        buttonText: "Indulhat!",
        features: [
          "Minden a Fejlődő csomagból",
          "Korlátlan számú üzlet kezelése",
          "Havonta korlátlan számú új értékelés",
          "Korlátlan számú szerencsekerék",
          "Gyors támogatás – 2 órán belüli válaszadással",
          "Fejlesztési kérések",
          "Egyéni betanítás",
        ],
        badge: "Minden benne van",
      }
    },
     // ← EZ hiányzott!

    // Add new Hungarian translations for trial and pricing
    daysLeftInTrial: "{days} nap maradt a próbaidőszakból",
    choosePlanAfterTrial: "Válassz egy csomagot a funkciók további használatához a próbaidőszak után.",
    choosePerfectPlan: "Válaszd ki a vállalkozásodnak megfelelő csomagot",
    freeTrialBanner: "Kezdd el a 14 napos ingyenes próbát — nem kell bankkártya!",
    freeTrialShortLine: "Kezdd el a 14 napos próbát — nem kell bankkártya!",
    noCreditCardRequired: "Nem kell bankkártya. Nincs elköteleződés. Csak eredmények.",
    currentPlan: "Jelenlegi csomag",
    monthly: "Havi",
    yearly: "Éves",
    save20Percent: "20% kedvezmény",
    getStarted: "Kezdd el",

    // Challenge Landingpage vendéglátós
    challengeHeadline: "[INGYENES]<br class='block sm:hidden' /> 5 NAPOS BEVÉTELNÖVELŐ KIHÍVÁS VENDÉGLÁTÓ-<wbr />HELYEKNEK",
    challengeSubline: "Növeld a forgalmad kis költségvetéssel – és újra érezd azt a büszkeséget, amiért elkezdted ezt az egészet!",
    challengeQuestion: "<h2 class='text-2xl sm:text-3xl font-bold mb-6'>Te is voltál már úgy, hogy este bezárás után elgondolkodtál: megéri ez az egész? Ennyi munka, ilyen kevés haszonért?</h2>",
    challengeMarketingBoost: "Sokan érzik most ezt.<br />De nem vagy egyedül, és nem is kell lemondanod az álmodról.<br /><strong>Ez az ingyenes e-mail sorozat neked szól, ha szeretnél új lendületet adni vendéglátóhelyednek</strong> és nyitott vagy néhány pofonegyszerű, de hatásos marketing trükkre, amit akár már ma bevethetsz – <strong>10 ezer Ft-nál kevesebbért</strong>.",
    challengeCtaButton: "Jöhetnek a tippek!",
    challengeSubheadline: "5 bevételnövelő marketing tipp vendéglátósoknak 10 ezer Ft alatt",

    challengeWhatYouGetTitle: "Mit kapsz, ha részt veszel a kihívásban?",
    challengeTip1Title: "Egyszerű, de hatékony tippek",
    challengeTip1Desc: "Nem kell marketingesnek lenned. Ezek a tippek azért készültek, hogy <strong>egyedül is meg tudd csinálni</strong> őket – akkor is, ha épp nincs kapacitásod új kampányokat tervezni vagy hirdetéseket gyártani. Minden ötlet könnyen érthető, gyorsan alkalmazható.",
    challengeTip2Title: "Gyakorlati útmutatókat",
    challengeTip2Desc: "Megmondjuk, pontosan mit csinálj. Mit írj ki a Facebookra, hova tedd a QR-kódot, mit mondj a vendégeknek. Nem csak inspirációt adunk, hanem kézzelfogható megoldásokat, amik <strong>azonnal működésbe hozhatók – akár napi 15 perc alatt</strong>.",
    challengeTip3Title: "Olyan stratégiákat, amik valóban pénzt hoznak a kasszába",
    challengeTip3Desc: "Nem csak 'láthatóbbá' válik tőle a helyed, hanem több vendéged lesz. A tippek mindegyike bevételnövelésre lett kitalálva: <strong>több rendelés, több visszatérő vendég</strong> – és végre azt érezheted, hogy megéri csinálni.",    
    challengeTip4_1Title: "Vendéglátósokra szabott ötleteket",
    challengeTip4_2Title: "Szállásadókra szabott ötleteket",
    challengeTip4_1Desc: "Mind az 5 levélben olyan javaslatokat olvashatsz, amelyek <strong>100%-ban a vendéglátó iparra vannak szabva</strong>. Azon belül is kis- és közepes méretű vendéglátók lehetőségeihez mértük az ötleteket, egy eiztes lehetsz benne, hogy <strong>mindegyiket tudod hasznosítani</strong>.",
    challengeTip4_2Desc: "Mind az 5 levélben olyan javaslatokat olvashatsz, amelyek <strong>100%-ban a szállás iparra vannak szabva</strong>. Azon belül is kis- és közepes méretű szállásadók lehetőségeihez mértük az ötleteket, egy eiztes lehetsz benne, hogy <strong>mindegyiket tudod hasznosítani</strong>.",
    challengeTip5Title: "Költséghatékony eszközöket",
    challengeTip5Desc: "Tudjuk, hogy a marketingre jut a legkevesebb egy szállásadónál, így <strong>mindegyik ajánlásunk maximum havi 10 ezer forintba kerül neked</strong>. Ennek a sokszorosát fogja visszahozni bevételben mind az 5 javaslatunk.",


    challengeWhoTitle: "Neked való, ha…",
    challengeWho1: "van egy kávézód / bisztród / reggeliződ / borbárod / söröződ / éttermed / pékséged és szeretnél új vendégeket szerezni, de nem akarsz hirdetésekre költeni.",
    challengeWho2: "nem vagy marketinges, de szívesen tanulnál meg néhány egyszerű trükköt, amitől több lesz a bevételed.",
    challengeWho3: "eleged van abból, hogy rengeteget dolgozol, mégsem jön ki a matek – és keresed a kiutat.",

    challengeWhyTitle: "Miért éri meg részt venni a kihívásban?",
    challengeWhy1: "✅ Mert ezek nem elméleti tippek – hanem olyan módszerek, amiket már <strong>rengeteg vendéglátós sikerrel alkalmazott</strong>.",
    challengeWhy2: "✅ Mert hisszük, hogy <strong>nem csak a nagy láncoknak jár, hogy profin kommunikáljanak</strong> a vendégeikkel.",
    challengeWhy3: "✅ És mert <strong>néha elég egy kis változtatás, hogy újra elinduljon</strong> valami.",

    challengeSignupTitle: "📬 Kérd az ingyenes bevételnövelő tippeket most!",
    challengeSignupSubline: "Add meg az e-mail címed, és már küldjük is az első levelet – benne a legolcsóbb, leghatékonyabb marketingtrükkel, ami sok vendéglátós életét megváltoztatta. Nincs veszítenivalód – csak egy újabb mínuszos napot, amit elkerülhetsz.",
    challengeCtaButton: "Kérem az 5 marketing tippet!",

    // Challenge Landingpage Szállásadó
    challengeHeadline_2: "[INGYENES]<br class='block sm:hidden' /> 5 NAPOS BEVÉTELNÖVELŐ KIHÍVÁS SZÁLLÁSADÓKNAK-<wbr />",
    challengeQuestion_2: "<h2 class='text-2xl sm:text-3xl font-bold mb-6'>Te is voltál már úgy, hogy egy hosszú vendégszezon után elgondolkodtál: megéri ez az egész? Ennyi munka, ilyen kevés haszonért?</h2>",
    challengeMarketingBoost_2: "Sokan érzik most ezt.<br />De nem vagy egyedül, és nem is kell lemondanod az álmodról.<br /><strong>Ez az ingyenes e-mail sorozat neked szól, ha szeretnél új lendületet adni szálláshelyednek</strong> és nyitott vagy néhány pofonegyszerű, de hatásos marketing trükkre, amit akár már ma bevethetsz.",
    challengeSubheadline_2: "5 bevételnövelő marketing tipp szállásadóknak 10 ezer Ft alatt",
    challengeWho1_2: "van egy vendégházad / apartmanod / panziód / falusi szállásod / airbnb-d és szeretnél új vendégeket szerezni, de nem akarsz hirdetésekre költeni.",
    challengeWhy1_2: "✅ Mert ezek nem elméleti tippek – hanem olyan módszerek, amiket már <strong>rengeteg szállásadó sikerrel alkalmazott</strong>.",
    challengeSignupSubline_2: "Add meg az e-mail címed, és már küldjük is az első levelet – benne a legolcsóbb, leghatékonyabb marketingtrükkel, ami sok szállásadó életét megváltoztatta. Nincs veszítenivalód – csak egy újabb gyenge szezon, amit elkerülhetsz.",

        // Challenge Landingpage Szépségiparban dolgozóknak
    challengeHeadline_3: "[INGYENES]<br class='block sm:hidden' /> 5 NAPOS BEVÉTELNÖVELŐ KIHÍVÁS SZÉPSÉGIPARBAN DOLGOZÓKNAK-<wbr />",
    challengeQuestion_3: "<h2 class='text-2xl sm:text-3xl font-bold mb-6'>Te is voltál már úgy, hogy egy hosszú nap után elgondolkodtál: megéri ez az egész? Ennyi munka, ilyen kevés haszonért?</h2>",
    challengeMarketingBoost_3: "Sokan érzik most ezt.<br />De nem vagy egyedül, és nem is kell lemondanod az álmodról.<br /><strong>Ez az ingyenes e-mail sorozat neked szól, ha szeretnél új lendületet adni szalonodnak vagy szolgáltatásodnak</strong> és nyitott vagy néhány pofonegyszerű, de hatásos marketing trükkre, amit akár már ma bevethetsz – <strong>10 ezer Ft-nál kevesebbért</strong>.",
    challengeSubheadline_3: "5 bevételnövelő marketing tipp szépségipari szolgáltatóknak 10 ezer Ft alatt",
    challengeWho1_3: "fodrász, borbély, masszőr, manikűrös, pedikűrös vagy bármilyen szépészeti kezelést végzel és szeretnél új vendégeket szerezni, de nem akarsz hirdetésekre költeni.",
    challengeWhy1_3: "✅ Mert ezek nem elméleti tippek – hanem olyan módszerek, amiket már <strong>rengeteg szépségipari szolgáltató sikerrel alkalmazott</strong>.",
    challengeSignupSubline_3: "Add meg az e-mail címed, és már küldjük is az első levelet – benne a legolcsóbb, leghatékonyabb marketingtrükkel, ami sok szépségipari vállalkozó életét megváltoztatta. Nincs veszítenivalód – csak egy újabb üres időpont, amit elkerülhetsz.",

    infoBlock1Headline: "TUDTAD?",
    infoBlock1Body: "➡️ A vásárlók 92%-a elolvassa az online értékeléseket, mielőtt vásárolna (PowerReviews 2023, Trustmary 2025)",

    infoBlock2Headline: "A friss értékelések még többet számítanak",
    infoBlock2Body: "➡️ A vásárlók 88%-a annyira megbízik az értékelésekben, mint a személyes ajánlásokban (WiserNotify 2025)",

    infoBlock3Body: "➡️ Az ügyfelek 72%-ának megerősíti a bizalmát a szolgáltató felé, ha pozitív véleményeket olvas róla (WiserNotify 2025)",

    infoBlockFinalCta: "Az a vállalkozás tud talpon maradni és bevételt növelni, amely folyamatosan gyűjti a pozitív vásárlói visszajelzéseket.",

    // ---------- Pain-points block ----------
    problemsBlockHeadline: "3 probléma, ami viszi tőled a pénzt:",
    
    problems1Title: "A néma vásárlói többség",
    problems1Bullet1: "A boldog vásárlóid 95%-a anélkül távozik, hogy megosztaná a tapasztalatait",
    problems1Bullet2: "Pozitív történeteik sosem jutnak el a leendő vásárlókhoz",
    problems1Bullet3: "A szájról szájra terjedő ajánlások megrekednek a privát beszélgetésekben",
    
    problems2Title: "A Google-láthatatlanság válsága",
    problems2Bullet1: "Vállalkozásod kevésbé tűnik megbízhatónak, mint a több értékeléssel rendelkező versenytársaké",
    problems2Bullet2: "A gyengébb Google-helyezés miatt kevesebben találnak rád",
    problems2Bullet3: "A potenciális ügyfelek az értékelések száma és átlaga alapján a konkurenciát választják",
    
    problems3Title: "A visszatérő vásárlók elvesztése",
    problems3Bullet1: "Nincs rendszeres kapcsolat a már elégedett ügyfelekkel",
    problems3Bullet2: "Elmaradnak az ajánlások és az ismételt vásárlások",
    problems3Bullet3: "A meglévő ügyfelek élettartam-értékét nem tudod megnövelni",

    // ---------- Cost of Inaction block ----------
    inactionBlockHeadline: "A TÉTLENSÉG ÁRA",
    inactionBullet1: "<strong>Elveszett vásárlók:</strong> Minden nap értékelések nélkül azt jelenti, hogy a potenciális vásárlók a konkurenciához mennek",
    inactionBullet2: "<strong>Csökkenő árazási mozgástér:</strong> Folyamatos pozitív vélemények nélkül nehéz prémium árat kérni",
    inactionBullet3: "<strong>Elmulasztott növekedés:</strong> Hiteles vásárlói visszajelzések hiányában nehéz szintet lépni",
    
    // Transition Question Block
    transitionQuestionHeadline: "Szeretnéd te is folyamatosan friss és pozitív Google értékelésekkel növelni a bevételed?",

    // New content block
    newBlockDescription: `<h2 class='text-2xl sm:text-3xl font-semibold text-gray-900 mb-2'>Mindössze annyi a feladatod, hogy <strong class='font-semibold'>állítsd végre csatasorba a vendégeid.</strong></h2>`,
    newBlockDescriptionExtended: `<h2 class='text-2xl sm:text-3xl font-semibold text-gray-900 mb-2'>A <strong class='font-semibold'>Review-to-Revenue-val</strong> a <strong class='font-semibold'>legjobb vendégeidből</strong> 30 másodperc alatt <strong class='font-semibold'>lelkes értékelők</strong> lesznek.</h2>`,
    newBlockNoNeedListTitle: "Nincs szükséged:",
    newBlockNoNeedList: [
      "❌ több százezer forintért legyártott profi videókra,",
      "❌ drága influencer együttműködésekre,",
      "❌ megduplázni a PPC kampányod büdzséjét,",
      "❌ vagy naponta TikTok videók posztolására."
    ],
    newBlockFinalLine: "Mindössze annyi a feladatod, hogy állítsd végre csatasorba a vendégeid.",
    revenueEngineHeadline: "Így termel bevételt neked a Review-to-Revenue",

    // Review-to-Revenue Intro Section
    r2rIntroHeadline: "Ez a Review-to-Revenue.",
    r2rIntroSubline: "Egy <strong>játékos eszköz, amivel villámgyorsan gyűjtöd az új vásárlói véleményeket</strong>. Ez az egyszerű, magyarul is működő rendszer segít automatikusan több vendégértékelést gyűjteni – <strong>QR-kódos, mobilbarát, nem kell hozzá semmit letölteni</strong> vagy applikációt telepíteni sem neked, sem a vendégednek. Azért zseniális, mert minden új vélemény új esély arra, hogy egy ismeretlenből vendéged legyen. <strong>Minél több friss, pozitív értékelésed van, annál többen fognak téged választani</strong> a konkurencia helyett.",    

    r2rFeatures: [
      "✅ Több friss Google-értékelés – automatikusan\nNincs több könyörgés a vendégeknek, a rendszer helyetted dolgozik.",
      "✅ Kiemelkedsz a többi hely közül\nTöbb vélemény = jobb helyezés és több kattintás a Google-ben.",
      "✅ Nem kell hirdetni, mégis több vendég jön\nA jó vélemények a legolcsóbb, leghitelesebb reklámok.",
      "✅ Pár perc alatt beállítható – technikai tudás nélkül\nEgyszerű, gyors, felhasználóbarát – bárki elboldogul vele.",
      "✅ Negatív vélemények szűrése\nA kevésbé jó értékelések privátban segítenek fejlődni – anélkül, hogy romlana a hírneved.",
      "✅ Értékes e-mail címek gyűjtése\nPlusz egy kattintással feliratkoztathatod a vendégeid a hírleveledre, így kapcsolatban tudtok maradni.",
      "✅ Mindezt havi 10 kávé áráért\nCsak 29 dollár havonta – és megkapod a legértékesebb online eszközt, amivel beelőzheted a konkurenciád."
    ],

    r2rHowToUseTitle: "Így működik a Review-to-Revenue",
    r2rHowToUseIntro1: "Fizetés után a vendéged elégedetten mosolyog, a kezében a telefonja. Készen áll, hogy elmondja a világnak, mennyire <strong class='font-semibold'>nagyszerűen érezte magát</strong> nálad. Ha elmulasztod ezt a varázslatos pillanatot, később már sokkal nehezebb lesz őt rávenni erre.",
    r2rHowToUseIntro2: `Fizetés után a vendéged boldog – most van itt a <strong class='font-semibold'>tökéletes pillanat</strong>, hogy értékelést kérj tőle. Később sokkal nehezebb lesz rávenni. 💡 Használd ki ezt az élmény utáni <strong class='font-semibold'>„wow-pillanatot”</strong>! A Review-to-Revenue-val <strong class='font-semibold'>játékos formában kérhetsz Google értékelést</strong>:<br/><br/>
    🎯 Hozz létre egy szerencsekereket,<br/>
    🎯 Add meg a nyereményeket és Google linkedet,<br/>
    🎯 Mutasd meg a QR-kódot a vendégnek fizetéskor.`,
    r2rHowToUseQuestion: `Kérdezd meg: „<strong class='font-semibold'>Van kedved egy nyereményért cserébe értékelni minket?</strong>” – és mutasd meg a Review-to-Revenue-ban generált QR-kódot. A rendszer <strong class='font-semibold'>innentől automatikusan elvégzi helyetted a többit</strong>.`,
    r2rHowToUseSteps: [
      "A vendég nagyszerűen érzi magát nálad,",
      "Megkéred, hogy értékeljen egy nyereményért cserébe → boldogan igent mond,",
      "Megpörgeti a szerencsekereket és nyer egy kis ajándékot vagy kedvezményt,",
      "Megírja a <strong class='font-semibold'>pozitív véleményét</strong>, ettől még jobban érzi magát,",
      "Ekkor <strong class='font-semibold'>örömmel megadja az e-mail címét</strong>,",
      "Neked pedig lett egy új 5 csillagos értékelésed és egy új feliratkozód."
    ],
    r2rHowToUseFootnote:
      "* Ajánlj valami nagy értékű dolgot főnyereményként. Például egy két fős reggeli/ebéd/vacsora, egy üveg drága bor vagy egy nagy kedvezmény. Állítsd be az esélyt alacsonyra – pl. 1–2%-ra. Így sokkal vonzóbb lesz a játék, mégsem terheli meg a kasszát.",
    

    r2rGuestExperienceIntro: "Így működik a Review-to-Revenue a vendégeknél",
    r2rGuestExperienceHeadline: "Ezért hasít a Review-to-Revenue módszere:",
    gamifiedRequestHeadline: "A játékba ágyazott értékelések sokszorosító hatása",
    gamifiedRequestText: "🎯 Szórakoztató élmény → Sokkal több vendég ír értékelést (85% vs. iparági átlag 3%)<br/>🎁 Azonnali jutalmak → Azonnali elégedettség és hűség<br/>📱 Mobilra tervezve → Tökéletesen illeszkedik az Y és Z generáció okostelefon-világához<br/>🏆 Garantált nyeremények → Pozitív márkaélmény és szájról szájra terjedő marketing<br/>🔁 Visszatérésre ösztönző jutalmak → Közvetlen bevétel az ismételt látogatásokból",
    engagementBoostHeadline: "",
    satisfiedGuestsToMarketing: "Az elégedett vendégeket alakítsd át a legerősebb marketing csatornáddá – értékelésekkel, amelyek megsokszorozzák a bevételeidet!",
    guestsScanPlayWin: "A vendégek beszkennelik a QR kódot, írnak egy értékelést, megpörgetik a kereket és visszajönnek a nyereményért. Te csak számold az új csillagokat és a növekvő bevételt.",

    // New revenue block keys
    revenueBlockHeadline: "3 + 1 bevételtermelő képesség, amit kiaknázhatsz a Review-to-Revenue-val",
    rev1Title: "Több Google értékelés ⭐️⭐️⭐️⭐️⭐️",
    rev1Body: "Amikor valaki éttermet, kávézót vagy cukrászdát keres, szinte biztos, hogy megnézi a Google-térképen a véleményeket. <strong>Ha látja, hogy nálad sok a friss, pozitív értékelés, nagyobb eséllyel választ téged.</strong><br/><br/>Gyorsabban jelensz meg a Google Maps-en, előrébb rangsorol a kereső, és kitűnsz a versenytársak közül, akik még mindig a régi \"Légyszi értékelj!\" módszert használják.",
    rev2Title: "Nem csak a mennyiség, a minőség is számít 💯",
    rev2Body: "Egy rossz nap, egy figyelmetlen pillanat, és máris beeshet pár negatív értékelés, ami lehúzza az átlagot – emiatt vendégek dönthetnek úgy, hogy máshol költik a pénzüket.🥴<br/><br/><strong>A Review to Revenue abban segít, hogy a legjobb vendégélményeid hangosabban szóljanak.</strong> Minél több elégedett vendég értékel, annál kevésbé számít egy-egy kevésbé jól sikerült pillanat.",
    rev3Title: "Visszatérő vásárlók generálása ♻️",
    rev3Body: "Adj olyan nyereményeket, amelyeket a vendég csak a következő látogatáskor válthat be, és máris elindítottad a visszatérés folyamatát.<br/><br/><strong>Egy 10–15 %-os kupon hamar lejár – a vendég emlékezni fog, hogy érdemes visszajönnie.</strong>",
    rev4Title: "E-mail gyűjtés – valódi aranybánya 💸",
    rev4Body: "A vendég értékelt, nyert, és máris megadta az e-mail-címét. <strong>Tökéletes alkalom, hogy exkluzív ajánlatokat küldj.</strong><br/><br/>Ügyfeleink 30–40 %-os feliratkozási arányt látnak – máshol akár 1500–2000 Ft-ot fizetnél egy címért, itt gyakorlatilag ajándék.",
    revenueBlockCta: "Építsd a bevételed most!",


    ctaPrimary: "Kezdjük el",
    ctaSecondary: "Vágjunk bele",
    ctaTertiary: "Kipróbálom",
    ctaFooter: "Lépj a következő szintre",

    reviewAskTitle: "Köszönjük, hogy nálunk játszottál!",
    reviewAskCopy: "Milyen volt a nálunk töltött idő?<br/><strong>Szeretnénk hallani rólad</strong> – a visszajelzésed segít másoknak és nekünk is fejlődni.",
    openGoogleReviews: "Google értékelés írása",
    
    setupStepsTitle: "Így hozd létre 5+1 lépésben a saját véleménykérő rendszered",
    setupStepsSubtitle: "Egyszer állítod be, utána automatikusan működik.",
    setupSteps: [
      "Kattints a „Regisztrálok” gombra, és hozd létre az üzleti fiókodat és értékelő felületedet (3 perc).",
      "Adj meg 3–8 nyereményt és a hozzájuk tartozó valószínűséget a szerencsekerekedhez (2 perc).",
      "Töltsd le a rendszer által generált QR-kódodat (1 perc).",
      "Szerkeszd rá az étlapra/szórólapra/kis táblára/matricára a QR-kódot. TIPP: tedd mellé a főnyereményt és ezt a kérdést: „Értékelnél minket egy nyereményért?” (5 perc).",
      "Nyomtasd ki magad vagy küldd el a nyomdába (5 perc + nyomtatási idő).",
      "Tedd ki jól látható helyekre a QR-kódot, pl. asztalokra, kasszához, mosdóba (+1, 5 perc)."
    ],
    setupStepsOutro:
      "Ezután nincs más dolgod, mint az elégedett vendégek figyelmébe ajánlani a lehetőséget. Innentől a rendszer automatikusan működik, és hónapról hónapra hozza a plusz csillagokat és bevételt.",

    ltd: {
      barText: "A Founding Member Lifetime most elérhető. Az árak jövő hónapban emelkednek.",
      barCta: "Szerezd meg",
      countdownLabel: "Hónap végéig hátra: {countdown}",
      badge: "Lifetime",
      title: "Founding Member",
      subtitle: "Egyszer fizetsz. Örökre használod.",
      priceNote: "egyszeri díj 1 üzletre",
      features: {
        wheels: "Legfeljebb 3 szerencsekerék",
        reviews: "Havi 200 új értékelés",
        emails: "Vendég e‑mailek letöltése",
        tutorials: "Rövid videós útmutatók",
        stats: "Saját statisztika felület",
        updates: "Minden jövőbeli frissítés"
      },
      addExtraLabel: "További üzlet hozzáadása",
      each: "+{price} / üzlet",
      totalLabel: "Összesen",
      cta: "Founding Member Lifetime megszerzése",
      redirecting: "Átirányítás…"
    }
  },
  
  de: {
    // Review page
    reviewHeadline: "Dreh am Rad und gewinne!",
    reviewHeadlineShort: "Bewertung abgeben & gewinnen!",
    standachance: "Hast die Chance zu gewinnen",
    reviewThanks: "🎉 Danke für deine Bewertung! Jetzt kannst du am Glücksrad drehen!",
    tapToRate: "Tippe, um deine Erfahrung zu bewerten",
    leaveReview: "Google Bewertung abgeben",
    spinWheel: "Glücksrad drehen",
    spinning: "Dreht sich...",
    congratulations: "Herzlichen Glückwunsch!",
    youWon: "Du hast gewonnen:",
    getReward: "Belohnung einlösen",
    emailPlaceholder: "du@example.com",
    emailPrivacy: "Deine E-Mail verwenden wir nur, um dir deine Belohnung zuzusenden.",
    emailMarketingOptIn: "Ich möchte zukünftig Angebote und Rabatte von {business_name} erhalten und akzeptiere die <a href='/privacy' target='_blank' class='underline text-blue-600'>Datenschutzerklärung</a>.",
    sending: "Wird gesendet...",
    successMessage: "Deine Belohnung wurde per E-Mail verschickt!<br><strong>Schau auch im Spam- oder Promotions-Ordner nach.</strong>",
    redirectingNotice: "Wir öffnen die Google-Bewertungsseite in einem neuen Tab. <strong>Nachdem du deine Bewertung abgegeben hast, schließe den neuen Tab und kehre hierher zurück, um das Glücksrad zu drehen und deinen Gewinn abzuholen!</strong> 🎁",
    emailAlreadyUsed: "Du hast bereits mit dieser E-Mail-Adresse am Gewinnspiel teilgenommen.",
    genericSaveError: "Beim Speichern deiner Daten ist ein Fehler aufgetreten. Bitte versuche es erneut.",

        // Email template
    emailSubject: "Deine Belohnung von {businessName} ist da 🎁",
    emailGreeting: "Hallo!",
    emailThanks: "Danke, dass du bei {businessName} warst 🙌",
    emailWinMessage: "Du hast am Glücksrad gedreht – und gewonnen!",
    emailImportant: "Wichtig:",
    emailQrOneTime: "Dein QR-Code kann nur einmal verwendet werden",
    emailQrExpires: "Gültig bis",
    emailQrTitle: "🎁 Dein QR-Code für die Belohnung:",
    emailQrInstructions: "Zeige diesen QR-Code dem Personal, um deine Belohnung zu erhalten",
    emailQrBackupLinkText: "QR-Code nicht sichtbar? Du kannst ihn hier öffnen",
    emailClosing: "Wir hoffen, diese kleine Überraschung verschönert dir den Tag!",
    emailSignature: "Mit freundlichen Grüßen,",
    emailTeam: "Dein {businessName}-Team",
    emailPS: "PS: Kennst du jemanden, der von mehr Google-Bewertungen profitieren und daraus Einnahmen erzielen könnte?",
    emailPSLinkText: "👉 Probiere Review to Revenue – einfach, effektiv und für lokale Unternehmen gemacht 🚀",
    downloadYourPrize: "Deinen Gewinn herunterladen",

    // QR redeem page
    redeemTitle: "Deine Belohnung",
    you_won_title: '🎁 Glückwunsch, du hast gewonnen:',
    rewardExpired: "Diese Belohnung ist abgelaufen",
    rewardRedeemed: "Diese Belohnung wurde bereits eingelöst",
    use_coupon_label: 'Verwende diesen Gutscheincode beim Bezahlen:',
    redeemButton: "Belohnung einlösen",
    redeeming: "Wird eingelöst...",
    expiresOn: "Gültig bis",

    // Wheel preview additions
    availablePrizes: "Verfügbare Preise",
    previewOfGuests: "Vorschau für deine Gäste",
    editProject: "Projekt bearbeiten",
    backToProjects: "Zurück zu den Projekten",

    // Review timing section - NEW
    reviewTimingParagraph: "Nach dem Bezahlen lächelt dein Gast, das Handy in der Hand – bereit, der Welt zu erzählen, wie toll es war. Wenn du diesen Moment verpasst, ist es später viel schwieriger, ihn zur Bewertung zu motivieren. Anstatt Tage später (wenn du überhaupt daran denkst im Alltagsstress) um eine Bewertung zu bitten, gib ihnen ein 60‑Sekunden‑Spiel, das sie gerne spielen. Sie bekommen eine Belohnung, du bekommst eine neue Google-Bewertung – alle gewinnen.",
    reviewTimingHeadline: "Verwandle zufriedene Gäste in deinen stärksten Marketingkanal – mit Bewertungen, die deinen Umsatz vervielfachen!",

    // Landing page
    landingHeroHeadline: "AUS BEWERTUNGEN WIRD UMSATZ",
    landingHeroSubline: `Die Google-Bewertung ist der erste Eindruck von dir. Potenzielle Gäste wählen immer den Ort mit mehr und besseren Bewertungen. Review-to-Revenue ist eine <span class="text-[#4FC3F7] font-semibold">automatische und spielerische Lösung</span>, die dir kontinuierlich Sterne und Umsatz bringt.<br><span class="block text-sm sm:text-base mt-2 text-gray-600"><em>Effektiver als eine Marketingagentur – und kostet nur einen Bruchteil.</em></span>`,
    landingHeroCta: "14 Tage kostenlos testen",

    crisisHeadline: "Gäste entscheiden heute anhand von Google-Bewertungen – besonders Touristen oder Erstbesucher.",
    crisisDescription: `Wenn du bereits gut dastehst bei deinen Bewertungen, ist das kein Zufall, sondern das Ergebnis einer durchdachten Strategie. In diesem Fall wirst du Review-to-Revenue lieben, denn es <span class="font-semibold text-[#4FC3F7]">automatisiert deine Abläufe</span> und <span class="font-semibold text-[#4FC3F7]">vervielfacht deine Ergebnisse</span>.<br/>
    <span class="block mt-2">Schon bald zeige ich dir <span class="font-semibold">3 Umsatz-Booster</span>, die unser System dir bieten kann.</span><br/><br/>
    Wenn dein Google-Bewertungsschnitt bei 4,5 oder darunter liegt, solltest du dich der harten Realität stellen. Steht dein Konkurrent zwei Straßen weiter bei 4,8, dann sieht die Rechnung für Gäste so aus:<br/>
    <span class="font-semibold">4,8 Sterne schlägt 4,5 (oder weniger).</span><br/>
    <span class="block mt-2">Jedes. Einzelne. Mal.</span><br/>
    Ein Lokal verliert täglich rund 3–5 Gäste nur wegen des Bewertungsunterschieds. <span class="italic text-gray-700">(Auch Hotels, Beautysalons, Yogastudios etc. verlieren in ähnlichem Ausmaß Umsatz.)</span><br/>
    <span class="block text-lg font-semibold text-red-600 mt-2">‼️ Das sind rund €10,000 Verlust pro Monat. ‼️</span>`,
    crisisSolution: `Wir haben ein <span class="font-semibold text-[#4FC3F7]">supereinfaches System</span>, das dir dieses Geld zurückholt – für den Preis von zwei Pizzen.`,    
    crisisCta: "Zeig mir die Lösung!",
    
    // New text additions
    noCreditCardRequired: "Keine Kreditkarte erforderlich. Keine Verpflichtung. Nur Ergebnisse.",
    rightAfterPayment: "Nach dem Bezahlen lächelt dein Gast zufrieden und hält sein Handy in der Hand.  <strong>Er ist bereit, der Welt zu erzählen, wie großartig sein Erlebnis bei dir war.</strong> Verpasst du diesen magischen Moment, wird es später viel schwerer, ihn dazu zu bringen.",
    awkwardReviewRequest: "💡 <strong>Nutze genau diesen Moment aus</strong> – wenn dein Gast gerade das tolle Erlebnis hinter sich hat. Aber wie bringst du ihn dazu, dir diesen kleinen Gefallen zu tun?",
    awkwardReviewRequest_2: "Es gibt eine <strong>genial einfache Lösung, mit der Menschen es lieben, eine Bewertung abzugeben.</strong>",    

    // micro-CTA in problem block
    startTrialCta: "Starte deine 14-tägige Testphase →",

    // CTA texts
    startFreeTrial: "Kostenlose Testversion starten",
    comparePlans: "Alle Tarife vergleichen →",

    // Pricing Section
    pricing: {
      solo: "Einzeln",
      growth: "Wachstum",
      unlimited: "Unbegrenzt",
      perMonth: "/Monat",
      soloBullet: "Bis zu 200 Bewertungen",
      growthBullet: "Bis zu 1 000 Bewertungen",
      unlimitedBullet: "Alles, unbegrenzt",
      bestValue: "Bestes Angebot",
    },

    // Description text for steps
    scanDescription: "Der Kunde scannt deinen individuellen QR-Code in diesem perfekten Moment—wenn die Zufriedenheit auf ihrem Höhepunkt ist und sie wirklich begeistert sind von dem, was du geliefert hast",
    leaveReviewDescription: "Sie teilen ihre echten Erfahrungen dort, wo es am wichtigsten ist—auf Google—or provide private feedback that helps you improve without damaging your online reputation",
    spinRedeemDescription: "Der magische Moment: Sie drehen sofort an unserem digitalen Glücksrad und gewinnen einen echten Preis, der sie nicht nur zum Lächeln bringt—sondern sie auch zurück durch deine Türen bringt",

    // Steps titles
    steps: {
      scanTitle: "1 · Scannen",
      leaveReviewTitle: "2 · Bewertung abgeben",
      spinRedeemTitle: "3 · Drehen & Einlösen"
    },
    starsAndRevenueTagline: "Und du zählst zufrieden die wachsenden Sterne und Einnahmen. 💸",

    // Other landing page section translations
    problemSolutionTitle: "74 % der Kunden ignorieren Bewertungen, die älter als ein Monat sind.",
    howItWorksTitle: "DAS SPIEL, DAS ALLES ÄNDERT",
    coreBenefits: {
      skyHighStarRating: "Hohe Sternebewertung",
      captureAuthenticFeedback: "Echte Rückmeldungen sammeln, wenn die Zufriedenheit am höchsten ist",
      privateNegativeFeedback: "E-Mail-Sammlung",
      addressConcerns: "Der Gast hat bewertet, gewonnen und direkt seine E-Mail-Adresse angegeben. Perfekter Moment für exklusive Angebote.",
      moreRepeatVisits: "Mehr Wiederholungsbesuche",
      turnOneTimeVisitors: "Wandle einmalige Besucher in treue, wiederkehrende Kunden um",
      // Keep the existing simplified keys for backward compatibility
      starRating: "Hohe Sternebewertung",
      privateFeedback: "Private negative Rückmeldungen",
      repeatVisits: "Mehr Stammkunden",
    },
    statsTitle: "+300 % Bewertungen · +22 % Wiederholungsumsatz",
    statsDescription: "Pilotstandorte erhielten durchschnittlich 87 neue Bewertungen monatlich und verzeichneten einen Anstieg von 22 % bei Folgeausgaben.",
    trustedByTitle: "FÜR WEN ist Review-to-Revenue?",
    restaurantsTitle: "Restaurants",
    barbershopsTitle: "Friseursalons",
    cafesTitle: "Cafés",
    hotelsTitle: "Hotels",
    retailTitle: "Einzelhandel",
    salonsTitle: "Salons",
    trustedByMore: "Fitnessstudios, Bistros, Bäckereien, Bierhäuser, Frühstückslokale, Salatbars, Blumengeschäfte, Autowerkstätten, Masseur:innen und viele mehr.",
    testimonialsTitle: "Was unsere Kunden sagen",
    pricingTeaserTitle: "Einfache, skalierbare Preisgestaltung",
    moreReviewsFlow: "Mehr Bewertungen ➡️ mehr Gäste ➡️ mehr Umsatz – Probiere es aus!",
    differentiatorTitle: "Gamifizierte Bewertungen schlagen traditionelle Anfragen – jedes Mal",
    differentiatorDescription: "Traditionelle Bewertungsanfragen scheitern, weil sie leicht ignoriert werden, unpersönlich wirken und den Kunden keinen echten Anreiz bieten. Flugblätter werden weggeworfen, E-Mails gelöscht, und deine potenziellen 5-Sterne-Bewertungen verschwinden.",
    engagementTitle: "47 % mehr Engagement",
    engagementDescription: "Gamification turns review requests into exciting, rewarding experiences customers actively seek out—leading to nearly double the participation.",
    revenueTitle: "32 % höherer Umsatz",
    revenueDescription: "Unternehmen mit starken, frischen Google-Bewertungen erzielen deutlich mehr Umsatz—because customers trust highly rated brands.",
    ignoreReviewsTitle: "74 % ignorieren Bewertungen, die älter als ein Monat sind.",
    ignoreReviewsDescription: "Die meisten Kunden überspringen Bewertungen, die älter als einen Monat sind—making it vital to constantly collect fresh feedback that reflects your current excellence.",
    marketingChannelDescription: "Verwandle zufriedene Gäste in deinen stärksten Marketingkanal – mit Bewertungen, die deinen Umsatz vervielfachen.",

    // Final CTA Section
    finalCtaTitle: "Bereit für mehr Bewertungen & Umsatz?",
    finalCtaDescription: "Beginne in wenigen Minuten mit dem Sammeln von 5-Sterne-Bewertungen – mit einem Spiel, das deine Kunden lieben.",
    finalCtaButton: "Jetzt spielen → 50 % Rabatt für 3 Monate",

    // Testimonials
    testimonials: {
      review1: "Wir haben im ersten Monat 102 Google-Bewertungen gesammelt – Gäste wollen unbedingt am Rad drehen!",
      review2: "Von 4.2★ auf 4.6★ in acht Wochen. Mehr Buchungen, das Team liebt das Spiel.",
      review3: "Gäste verlassen die Lobby nicht, bevor sie drehen. Bereits 29 % mehr wiederkehrende Gäste.",
      name1: "Koloni Restaurant",
      name2: "Bali Babe Salon",
      name3: "YOU Suite Seminyak"
    },

    trustedBySectionHeadline: "Für wen ist Review-to-Revenue gemacht?",
    trustedByCards: [
      "<strong>Gerade eröffnet und auf Google quasi unsichtbar</strong><br/>Alles ist schön, das Essen top – aber ohne 20–30 Bewertungen laufen Touristen einfach vorbei. Die ersten 100 schnell zu sammeln = Überlebensfaktor.",
      "<strong>Schon lange dabei, aber Stammgäste bleiben aus</strong><br/>Nostalgie reicht nicht mehr. Wenn die letzten Bewertungen 4 Jahre alt sind, wirkt es, als wäre niemand mehr da. Frische Bewertungen schaffen Vertrauen bei neuen Gästen.",
      "<strong>Um die Ecke hat ein neues, fotogenes Lokal eröffnet</strong><br/>Sie posten überall, schalten Ads, sind viral. Du hast zufriedene Gäste – aber sie erzählen noch nichts. Eine gezielte Bewertungsaktion bringt dich zurück ins Spiel.",
      "<strong>Deine Booking-/Google-Bewertung ist unter 4.5 gerutscht – und der Umsatz auch</strong><br/>Ein paar schlechte Tage, kritische Gäste, und die Buchungen bleiben aus. Neue, positive Bewertungen heben den Schnitt – ein entscheidender Faktor für viele.",
      "<strong>Du setzt auf Qualität, aber kannst kein Geld mehr in Werbung stecken</strong><br/>Google Ads sind teuer, Social Media fast wirkungslos. Mit Review-to-Revenue mobilisierst du Gäste für kleines Geld – und sie übernehmen dein Marketing, ehrlich und gratis."
    ],    
    trustedBySectionClosing: "Bewertungen sind heute bares Geld. Überlass sie nicht der Konkurrenz – nutze deine zufriedenen Gäste!",
    revenueBoostHeadline: "Review-to-Revenue steigert ihren Umsatz:",

    // Navigation
    nav: {
      useCases: "Anwendungsfälle",
      pricing: "Preise",
      contact: "Kontakt",
      signIn: "Anmelden"
    },

    pricingPlans: {
      solo: {
        name: "Einsteiger",
        period: "/Monat",
        buttonText: "Jetzt starten",
        features: [
          "1 Unternehmen",
          "Bis zu 3 Glücksräder",
          "Max. 200 neue Bewertungen/Monat",
          "Downloadbare Gästeliste mit E-Mails",
          "Kurze Videoanleitungen",
          "Zugriff auf eigene Statistiken"
        ]
      },
      growth: {
        name: "Wachstum",
        period: "/Monat",
        buttonText: "Ich wähle das",
        features: [
          "Alles aus Einsteiger",
          "Bis zu 3 Unternehmen",
          "Bis zu 15 aktive Räder",
          "Max. 1000 neue Bewertungen/Monat",
          "Individuelles Design"
        ],
        badge: "Beliebteste Wahl"
      },
      unlimited: {
        name: "Professionell",
        period: "/Monat",
        buttonText: "Los geht’s!",
        features: [
          "Alles aus Wachstum",
          "Unbegrenzte Anzahl an Unternehmen",
          "Unbegrenzte Anzahl an neuen Bewertungen/Monat",
          "Unbegrenzte Anzahl an Glücksrädern",
          "Schneller Support – Antwort innerhalb von 2 Stunden",
          "Feature-Wünsche möglich",
          "Individuelle Einschulung"
        ],
        badge: "Alles inklusive"
      }
    },

    // Challenge section
    challengeHeadline: "[KOSTENLOS]<br class='block sm:hidden' /> 5-TÄGIGE UMSATZ-CHALLENGE FÜR GASTRO<wbr />BEREICHE",
    challengeSubline: "Steigere deinen Umsatz mit kleinem Budget – és erinnere dich wieder daran, warum du damit überhaupt angefangen hast!",
    challengeQuestion: "<h2 class='text-2xl sm:text-3xl font-bold mb-6'>Hast du abends schon mal abgeschlossen und dich gefragt: Lohnt sich das alles? So viel Arbeit – für so wenig Gewinn?</h2>",
    challengeMarketingBoost: "Viele Menschen fühlen sich gerade so.<br />Aber du bist nicht allein – und du musst deinen Traum nicht aufgeben.<br /><strong>Diese kostenlose E-Mail-Serie ist genau das Richtige für dich, wenn du deinem Gastronomiebetrieb neuen Schwung geben möchtest</strong> – und offen bist für ein paar supereinfache, aber wirkungsvolle Marketingtricks, die du noch heute umsetzen kannst – <strong>für weniger als 25 €</strong>.",
    challengeCtaButton: "Her mit den Tipps!",
    challengeSubheadline: "5 Marketingtipps für Gastronomen, die deinen Umsatz steigern – für unter 25 €",

    challengeWhatYouGetTitle: "Was bekommst du, wenn du an der Challenge teilnimmst?",
    challengeTip1Title: "Einfache, aber effektive Tipps",
    challengeTip1Desc: "Du musst kein Marketingprofi sein. Diese Tipps sind so konzipiert, dass du <strong>sie alleine umsetzen kannst</strong> – selbst wenn du keine Zeit für neue Kampagnen oder Werbeanzeigen hast. Alles ist leicht zu verstehen und schnell umzusetzen.",
    challengeTip2Title: "Praktische Anleitungen",
    challengeTip2Desc: "Wir sagen dir genau, was du tun sollst. Was du auf Facebook posten kannst, wohin mit dem QR-Code, was du deinen Gästen sagen kannst. Kein Blabla – sondern <strong>konkrete, sofort anwendbare Lösungen, auch mit nur 15 Minuten pro Tag</strong>.",
    challengeTip3Title: "Strategien, die wirklich Umsatz bringen",
    challengeTip3Desc: "Diese Tipps machen deinen Laden nicht nur sichtbarer – sie bringen dir mehr Gäste. <strong>Mehr Bestellungen, mehr Wiederkehrer</strong> – und endlich das Gefühl: Es lohnt sich.",
    challengeTip4_1Title: "Ideen speziell für die Gastronomie",
    challengeTip4_2Title: "Ideen speziell für Unterkünfte",
    challengeTip4_1Desc: "In allen 5 E-Mails findest du <strong>Tipps, die zu 100 % auf die Gastronomie zugeschnitten sind</strong>. Wir haben sie speziell für kleine und mittelgroße Betriebe entwickelt – <strong>damit du jeden einzelnen einfach umsetzen kannst</strong>.",
    challengeTip4_2Desc: "In allen 5 E-Mails findest du <strong>Tipps, die zu 100 % auf die Unterkunftsbranche zugeschnitten sind</strong>. Wir haben sie speziell für kleine und mittelgroße Anbieter entwickelt – <strong>damit du jeden einzelnen einfach umsetzen kannst</strong>.",
    challengeTip5Title: "Kostenbewusste Tools",
    challengeTip5Desc: "Uns ist klar, dass für Marketing bei Unterkünften oft kaum Budget bleibt. Deshalb <strong>kostet jede unserer Empfehlungen maximal 10.000 Forint im Monat</strong> – bringt dir aber ein Vielfaches davon als zusätzlichen Umsatz ein.",    
    
    challengeWhoTitle: "Das ist für dich, wenn…",
    challengeWho1: "du ein Café, Bistro, Frühstückslokal, eine Bar, Kneipe, ein Restaurant oder eine Bäckerei betreibst – und neue Gäste willst, ohne Geld für Werbung auszugeben.",
    challengeWho2: "du kein Marketingprofi bist, aber einfache Tricks lernen willst, die deinen Umsatz steigern.",
    challengeWho3: "du es satt hast, viel zu arbeiten und trotzdem kaum Gewinn zu machen – und endlich eine Lösung suchst.",

    challengeWhyTitle: "Warum lohnt es sich, an der Challenge teilzunehmen?",
    challengeWhy1: "✅ Weil das keine Theorie ist – sondern <strong>praxiserprobte Methoden, die bereits vielen Gastronom:innen geholfen haben</strong>.",
    challengeWhy2: "✅ Weil wir glauben, dass <strong>nicht nur große Ketten professionell mit ihren Gästen kommunizieren dürfen</strong>.",
    challengeWhy3: "✅ Und weil <strong>oft schon eine kleine Änderung reicht, um etwas Großes zu bewegen</strong>.",

    challengeSignupTitle: "📬 Hol dir jetzt die kostenlosen Umsatzsteigerungs-Tipps!",
    challengeSignupSubline: "Gib deine E-Mail ein és wir schicken dir sofort den ersten Tipp – die günstigste und effektivste Strategie, die bereits das Leben vieler Gastronomen verändert hat.",
    challengeCtaButton: "Her mit den 5 Marketingtipps!",

    // Challenge Landingpage für Gastgeber:innen
    challengeHeadline_2: "[KOSTENLOS]<br class='block sm:hidden' /> 5-TÄGIGE UMSATZ-CHALLENGE FÜR GASTGEBER-<wbr />",
    challengeQuestion_2: "<h2 class='text-2xl sm:text-3xl font-bold mb-6'>Hattest du auch schon mal nach einer langen Saison das Gefühl: So viel Arbeit – für so wenig Gewinn?</h2>",
    challengeMarketingBoost_2: "Viele Gastgeber:innen érzik most ezt.<br />De nem vagy egyedül – és nem kell lemondanod az álmodról.<br /><strong>Ez az ingyenes e-mail sorozat neked szól, ha szeretnél új lendületet adni a szálláshelyednek</strong> és nyitott vagy néhány pofonegyszerű, de hatásos marketing trükkre, amit akár már ma bevethetsz",
    challengeSubheadline_2: "5 kostengünstige Marketing-Hacks für Gastgeber unter 30 €",
    challengeWho1_2: "du ein Gästehaus / Apartment / B&B / Landhotel / Airbnb betreibst und neue Gäste gewinnen möchtest – ohne Geld für Werbung auszugeben.",
    challengeWhy1_2: "✅ Weil das keine Theorien sind – sondern <strong>bewährte Taktiken, die bereits von unzähligen Gastgebern erfolgreich angewendet wurden</strong>.",
    challengeSignupSubline_2: "Gib deine E-Mail ein und wir schicken dir den ersten Tipp direkt in dein Postfach – mit dem günstigsten, effektivsten Trick, der das Spiel für viele Gastgeber verändert hat.",

        // Challenge Landingpage für Beauty-Profis
    challengeHeadline_3: "[KOSTENLOS]<br class='block sm:hidden' /> 5-TÄGIGE UMSATZ-CHALLENGE FÜR BEAUTY-PROFIS-<wbr />",
    challengeQuestion_3: "<h2 class='text-2xl sm:text-3xl font-bold mb-6'>Hattest du auch schon mal einen dieser Tage, an dem du denkst: Lohnt sich das alles für so wenig Gewinn?</h2>",
    challengeMarketingBoost_3: "Du vagy nem vagy egyedül.<br />De nem kell lemondanod az álmodról.<br /><strong>Ez az ingyenes e-mail sorozat neked szól, ha szeretnél új lendületet adni a szalonodnak vagy a szolgáltatásaidnak</strong> néhány nevetségesen egyszerű, de hatékony marketingtrükkel, amiket még ma elkezdhetsz használni – <strong>30 € alatt</strong>.",
    challengeSubheadline_3: "5 kostengünstige Marketing-Tipps für Beauty-Profis unter 30 €",
    challengeWho1_3: "Du bist Friseur:in, Barbier:in, Masseur:in, Nageldesigner:in oder bietest eine andere Beauty-Dienstleistung an – und möchtest mehr Kund:innen ohne Werbekosten.",
    challengeWhy1_3: "✅ Weil das keine theoretischen Tipps sind – sondern erprobte Methoden, die bereits <strong>zahlreiche Beauty-Profis mit Erfolg angewendet haben</strong>.",
    challengeSignupSubline_3: "Trag deine E-Mail-Adresse ein und wir schicken dir sofort die erste Nachricht – mit dem günstigsten und effektivsten Marketingtrick, der das Business vieler Beauty-Dienstleister:innen verändert hat. Du hast nichts zu verlieren – außer einem weiteren freien Termin, den du vermeiden könntest.",


    infoBlock1Headline: "WUSSTEST DU?",
    infoBlock1Body: "➡️ 92 % der Käufer lesen Online-Bewertungen, bevor sie einen Kauf tätigen (PowerReviews 2023, Trustmary 2025)",

    infoBlock2Headline: "Frische Bewertungen zählen noch mehr",
    infoBlock2Body: "➡️ 88 % der Käufer vertrauen Bewertungen genauso sehr wie persönlichen Empfehlungen (WiserNotify 2025)",

    infoBlock3Body: "➡️ 72 % der Kunden gewinnen mehr Vertrauen in einen Anbieter, wenn sie positive Bewertungen lesen (WiserNotify 2025)",

    infoBlockFinalCta: "Die Unternehmen, die überleben und ihren Umsatz steigern, sind diejenigen, die kontinuierlich positives Kundenfeedback sammeln.",

    // ---------- Pain-points block ----------
    problemsBlockHeadline: "3 Probleme, die dir das Geld aus der Tasche ziehen:",
    
    problems1Title: "Die schweigende Kundenmehrheit",
    problems1Bullet1: "95 % deiner zufriedenen Kunden gehen, ohne ihre Erfahrung zu teilen",
    problems1Bullet2: "Ihre positiven Geschichten erreichen potenzielle Käufer nie",
    problems1Bullet3: "Mund-zu-Mund-Empfehlungen bleiben in privaten Gesprächen stecken",
    
    problems2Title: "Die Google-Unsichtbarkeitskrise",
    problems2Bullet1: "Dein Unternehmen wirkt weniger vertrauenswürdig als Konkurrenten mit mehr Bewertungen",
    problems2Bullet2: "Schlechteres Google-Ranking heißt: weniger Auffindbarkeit",
    problems2Bullet3: "Potenzielle Kunden wählen anhand von Anzahl & Schnitt die Konkurrenz",
    
    problems3Title: "Verlorene Stammkunden",
    problems3Bullet1: "Kein regelmäßiger Kontakt zu bereits zufriedenen Kunden",
    problems3Bullet2: "Empfehlungen und Wiederkäufe bleiben aus",
    problems3Bullet3: "Der Customer Lifetime Value steigt nicht",

    // ---------- Cost of Inaction block ----------
    inactionBlockHeadline: "DIE KOSTEN DES NICHTSTUNS",
    inactionBullet1: "<strong>Verlorene Kunden:</strong> Jeder Tag ohne Bewertungen schickt potenzielle Käufer zur Konkurrenz",
    inactionBullet2: "<strong>Sinkender Preisspielraum:</strong> Stetig positive Bewertungen sind nötig, um Premiumpreise durchzusetzen",
    inactionBullet3: "<strong>Verpasstes Wachstum:</strong> Ohne glaubwürdige Kundenstimmen ist der nächste Wachstumsschritt schwer",
    
    // Transition Question Block
    transitionQuestionHeadline: "Möchtest du auch mit laufend frischen und positiven Google-Bewertungen deinen Umsatz steigern?",

    // New content block
    newBlockDescription: `<h2 class='text-2xl sm:text-3xl font-semibold text-gray-900 mb-2'>Alles, was du tun musst, ist, <strong class='font-semibold'>deine Gäste endlich ins Spiel zu bringen</strong>.</h2>`,
    newBlockDescriptionExtended: `<h2 class='text-2xl sm:text-3xl font-semibold text-gray-900 mb-2'>Mit <strong class='font-semibold'>Review-to-Revenue</strong> werden deine <strong class='font-semibold'>besten Gäste</strong> in nur 30 Sekunden zu <strong class='font-semibold'>begeisterten Bewertern</strong>.</h2><br>Kein Betteln, keine peinlichen Gespräche – nur ein <strong class='font-semibold'>QR-Code, den sie lieben</strong>, denn nach der Google-Bewertung <strong class='font-semibold'>drehen sie ein digitales Glücksrad</strong>, bei dem sie <strong class='font-semibold'>garantiert etwas gewinnen</strong>. Es handelt sich um <strong class='font-semibold'>für die Gäste wertvolle</strong>, aber <strong class='font-semibold'>für dich kostengünstige</strong> Rabatte und kleine Geschenke, die <strong class='font-semibold'>weitere Besuche fördern</strong>.`,
    newBlockNoNeedListTitle: "Du brauchst keine:",
    newBlockNoNeedList: [
      "❌ professionellen Videos für mehrere Hunderttausend Forint,",
      "❌ teuren Influencer-Kooperationen,",
      "❌ verdoppelten PPC-Budgets,",
      "❌ oder täglichen TikTok-Videos."
],
    newBlockFinalLine: "Du musst nur endlich deine Kund:innen für dich arbeiten lassen.",
    revenueEngineHeadline: "So bringt dir Review-to-Revenue bares Geld",


    // Review-to-Revenue Intro Section
    r2rIntroHeadline: "Das ist Review-to-Revenue.",
    r2rIntroSubline: "Ein <strong>spielerisches Tool, mit dem du blitzschnell neue Kundenbewertungen sammelst</strong>. Dieses einfache, auch auf Deutsch funktionierende System hilft dir dabei, automatisch mehr Gästebewertungen zu sammeln – <strong>per QR-Code, mobilfreundlich, ganz ohne Downloads oder App-Installationen</strong> für dich oder deine Gäste. Es ist genial, denn jede neue Bewertung ist eine neue Chance, aus einem Fremden einen zahlenden Gast zu machen. <strong>Je mehr aktuelle, positive Bewertungen</strong> du hast, desto mehr Menschen <strong>entscheiden sich für dich statt für die Konkurrenz</strong>.",
    
    r2rFeatures: [
      "✅ Mehr aktuelle Google-Bewertungen – automatisch\nKein Betteln mehr bei Kund:innen, das System übernimmt das für dich.",
      "✅ Du hebst dich von der Konkurrenz ab\nMehr Bewertungen = besseres Ranking und mehr Klicks auf Google.",
      "✅ Keine Werbung nötig und trotzdem mehr Kundschaft\nGute Bewertungen sind die günstigste und glaubwürdigste Werbung.",
      "✅ In wenigen Minuten eingerichtet – ganz ohne Technikkenntnisse\nEinfach, schnell, benutzerfreundlich – jede:r kommt damit klar.",
      "✅ Negative Bewertungen filtern\nKritik hilft dir intern weiter – ohne deinem Ruf zu schaden.",
      "✅ Wertvolle E-Mail-Adressen sammeln\nMit nur einem Klick abonnieren Kund:innen deinen Newsletter und bleiben in Kontakt.",
      "✅ All das für den Preis von 10 Kaffees im Monat\nNur 29 Dollar pro Monat – für das wertvollste Online-Tool, um deiner Konkurrenz voraus zu sein."
],

r2rHowToUseTitle: "So funktioniert Review-to-Revenue",
r2rHowToUseIntro1: "Nach dem Bezahlen lächelt dein Gast zufrieden und hält sein Handy in der Hand – bereit, der Welt zu erzählen, wie <strong class='font-semibold'>großartig sein Erlebnis</strong> war. Verpasst du diesen magischen Moment, wird es später viel schwieriger, eine Bewertung zu bekommen.",
r2rHowToUseIntro2: `Nach dem Bezahlen ist dein Gast glücklich – das ist der <strong class='font-semibold'>perfekte Moment</strong>, um um eine Bewertung zu bitten. Später wird es viel schwieriger sein. 💡 Nutze diesen <strong class='font-semibold'>Wow-Moment</strong> direkt nach dem Erlebnis! Mit Review-to-Revenue kannst du <strong class='font-semibold'>spielerisch um eine Google-Bewertung bitten</strong>:<br/><br/>
🎯 Erstelle ein Glücksrad,<br/>
🎯 Lege Gewinne und deinen Google-Link fest,<br/>
🎯 Zeige deinem Gast beim Bezahlen den QR-Code.`,
r2rHowToUseQuestion: `Frag: „<strong class='font-semibold'>Möchtest du uns für die Chance auf einen Gewinn bewerten?</strong>“ – und zeig ihm den QR-Code, den du mit Review-to-Revenue erstellt hast. <strong class='font-semibold'>Ab dann übernimmt das System den Rest für dich</strong>.`,
r2rHowToUseSteps: [
  "Der Gast hat bei dir eine großartige Zeit,",
  "Du lädst ihn ein, für eine Gewinnchance eine Bewertung abzugeben, und er sagt gerne zu,",
  "Er dreht am Glücksrad und gewinnt ein kleines Geschenk oder einen Rabatt,",
  "Er schreibt eine <strong class='font-semibold'>positive Bewertung</strong> und fühlt sich noch besser,",
  "Dann <strong class='font-semibold'>gibt er gerne seine E-Mail-Adresse an</strong>,",
  "Und du hast eine neue 5-Sterne-Bewertung und einen neuen Abonnenten."
],
r2rHowToUseFootnote:
  "* Biete einen <strong class='font-semibold'>hochwertigen Hauptgewinn</strong> an. Zum Beispiel: Frühstück/Mittagessen/Abendessen für zwei, eine edle Flasche Wein oder ein großer Rabatt. Setze die Gewinnchance niedrig (ca. 1–2 %). So bleibt das Spiel attraktiv, ohne deine Marge zu belasten.",

    r2rGuestExperienceIntro: "So funktioniert Review-to-Revenue für deine Gäste",
    r2rGuestExperienceHeadline: "Darum geht die Review-to-Revenue-Methode richtig ab:",
    gamifiedRequestHeadline: "Der Multiplikator-Effekt gamifizierter Bewertungen",
    gamifiedRequestText: "🎯 Unterhaltsames Erlebnis → Viel mehr Gäste bewerten (85 % vs. 3 % Branchenschnitt)<br/>🎁 Sofortige Belohnungen → Sofortige Zufriedenheit & Loyalität<br/>📱 Mobile-first → Ideal für die Smartphone-Welt von Gen Y & Z<br/>🏆 Garantierte Gewinne → Positives Markenerlebnis & Mundpropaganda<br/>🔁 Rückkehranreize → Direkter Umsatz durch Wiederbesuche",
    engagementBoostHeadline: "",
    engagementBoostText: "Das Glücksrad macht Bewertungsanfragen zu einem spannenden, belohnenden Erlebnis, das Gäste aktiv suchen – mit fast doppelt so vielen Teilnahmen.",
    satisfiedGuestsToMarketing: "Verwandle zufriedene Gäste in deinen stärksten Marketingkanal – mit Bewertungen, die deinen Umsatz vervielfachen!",

    guestsScanPlayWin: "Gäste scannen den QR-Code, hinterlassen eine Bewertung, drehen das Rad und kommen für ihren Gewinn zurück. Du musst nur die neuen Sterne und den steigenden Umsatz zählen.",

    // New revenue block keys
    revenueBlockHeadline: "3 + 1 Umsatz-Booster, die du mit Review-to-Revenue nutzt",
    rev1Title: "Mehr Google-Bewertungen ⭐️⭐️⭐️⭐️⭐️",
    rev1Body: "Wer nach einem Café, Restaurant oder Laden sucht, checkt zuerst die Google-Maps-Bewertungen. <strong>Viele frische 5-Sterne-Ratings lenken die Wahl zu dir.</strong><br/><br/>Du erscheinst schneller auf Maps, kletterst im Ranking und stichst Konkurrenten aus, die noch \"Bitte bewerte uns!\" rufen.",
    rev2Title: "Nicht nur Menge, auch Qualität zählt 💯",
    rev2Body: "Ein schlechter Tag des Service-Teams und schon landen ein paar 1-Sterne-Bewertungen, die den Schnitt drücken – Kunden wechseln zur Konkurrenz.🥴<br/><br/><strong>Review-to-Revenue hilft dir, dass deine besten Gästebewertungen lauter gehört werden.</strong> Je mehr zufriedene Gäste eine Bewertung abgeben, desto weniger ins Gewicht fallen einzelne Ausrutscher.",
    rev3Title: "Stammkunden generieren ♻️",
    rev3Body: "Gewinne, die erst beim nächsten Besuch eingelöst werden können, bringen Gäste garantiert zurück.<br/><br/><strong>Ein 10–15 % Gutschein mit Ablaufdatum erinnert sie daran, bald wiederzukommen.</strong>",
    rev4Title: "+1 E-Mail-Sammlung – pures Gold 💸",
    rev4Body: "Gast zufrieden, Bewertung abgegeben, Gewinn erhalten – und schon die E-Mail hinterlassen. <strong>Perfekter Moment für exklusive Angebote.</strong><br/><br/>30–40 % Opt-in-Rate sind üblich; anderswo zahlst du 3–4 € pro Kontakt, hier bekommst du sie quasi geschenkt.",
    revenueBlockCta: "Jetzt Umsatz steigern!",


    ctaPrimary: "Loslegen",
    ctaSecondary: "Jetzt starten",
    ctaTertiary: "Ausprobieren",
    ctaFooter: "Auf die nächste Stufe",

    // New keys
    disclaimer: "Nutzungsbedingungen",
    lowRatingThankYou: "Vielen Dank für dein Feedback! 🙏",
    lowRatingAppreciation: "Wir schätzen deine Ehrlichkeit – und belohnen dich mit einem besonderen Geschenk!",
    lowRatingCta: "Dreh am Glücksrad",    
    switchTabHint: "Die Bewertungsseite wurde in einem neuen Tab geöffnet. Wechsle bitte zum neuen Tab, schreibe deine Bewertung und kehre dann hierher zurück, um das Rad zu drehen!",
    popupBlockedHint: "Dein Browser hat das Öffnen eines neuen Fensters blockiert. Erlaube Pop-ups, damit wir dich zur Google-Bewertungsseite bringen können!",

    reviewAskTitle: "Danke, dass du bei uns gespielt hast!",
    reviewAskCopy: "Wie war deine Zeit bei uns?<br/><strong>Wir würden gerne von dir hören</strong> – dein Feedback hilft anderen und macht uns besser.",
    openGoogleReviews: "Google-Bewertung schreiben",

    setupStepsTitle: "Erstelle dein Bewertungssystem in 5+1 Schritten",
    setupStepsSubtitle: "Einmal einrichten, danach läuft es automatisch.",
    setupSteps: [
      "Klicke auf „Registrieren“ und erstelle dein Unternehmenskonto sowie die Bewertungsseite (3 Minuten).",
      "Füge 3–8 Gewinne und die jeweiligen Wahrscheinlichkeiten für dein Glücksrad hinzu (2 Minuten).",
      "Lade deinen vom System generierten QR-Code herunter (1 Minute).",
      "Platziere den QR-Code auf Speisekarte/Flyer/Aufsteller/Aufkleber. TIPP: Zeige den Hauptgewinn und füge diese Frage hinzu: „Bewertest du uns für eine Gewinnchance?“ (5 Minuten).",
      "Drucke es selbst aus oder gib es in die Druckerei (5 Minuten + Druckzeit).",
      "Bringe den QR-Code gut sichtbar an, z. B. auf Tischen, an der Kasse, im WC (+1, 5 Minuten)."
    ],
    setupStepsOutro:
      "Ab dann musst du nur noch zufriedene Gäste darauf hinweisen. Das System läuft automatisch und liefert Monat für Monat zusätzliche Sterne und Umsatz.",
  }
} as const;

export function useTranslation(language: Language = 'en') {
  return translations[language];
}

export function getTranslation(language?: Language) {
  const langFromStorage = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;
  const lang = language || (langFromStorage as Language) || 'en';

  return translations[lang] || translations['en'];
}