import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useTranslation from '../../hooks/useTranslation';
import Footer from '../../components/Footer';
import Card from '../../components/ui/Card';
import { mailerLiteForms } from "../../components/forms/mailerliteFormHtmls";

const embedHtml = mailerLiteForms.challengeBeauty;

export default function ChallengeLandingPage3() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    // OptiMonk campaign loading
    // (async () => {
    //   try {
    //     const res = await fetch('https://ipinfo.io/json?token=53cd9f60a714e6');
    //     const { country } = await res.json();
    //     const id = country === 'HU' ? 2 : 3;
    //     window.OptiMonk?.Api?.campaigns?.show(id);
    //   } catch (err) {
    //     window.OptiMonk?.Api?.campaigns?.show(3);
    //   }
    // })();

    // Hash scroll
    if (window.location.hash === '#signup-form') {
      document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
    }

    // MailerLite script betöltése
    const script = document.createElement("script");
    script.src =
      "https://groot.mailerlite.com/js/w/webforms.min.js?v176e10baa5e7ed80d35ae235be3d5024";
    script.async = true;

    /** ▶︎ A siker-callback bekötése
     *    A MailerLite a form ID-ből generál nevet:
     *    ml_webform_success_<formID>
     *    A challengeHost formodnál az ID: 27353476
     */
    // @ts-ignore – globális property-t adunk a window-hoz
    window.ml_webform_success_27353527 = () => {
      fbq('track', 'Lead');
      setSubmitted(true);
      // gördüljünk vissza a form helyére, hogy biztosan lássa
      document
        .getElementById("signup-form")
        ?.scrollIntoView({ behavior: "smooth" });
    };

    document.body.appendChild(script);

    // takarítás
    return () => {
      document.body.removeChild(script);
      // callback törlése, hogy más oldalakon ne lógjon ott
      // @ts-ignore
      delete window.ml_webform_success_27353527;
    };
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-white text-[#263238] font-[Alexandria,sans-serif]">
      {/* Hero Section */}
      <section className="pt-10 sm:pt-20 px-6 text-center">
   <motion.h1
  className="text-4xl sm:text-5xl font-bold mb-2 leading-tight max-w-5xl mx-auto"
  {...fadeIn}
  dangerouslySetInnerHTML={{ __html: t.challengeHeadline_3 }}
/>
        <motion.div
          className="max-w-3xl mx-auto"
          {...fadeIn}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl sm:text-3xl mb-6">
            {t.challengeSubline}
          </h2>
        </motion.div>
        <motion.img
          src="https://res.cloudinary.com/dsqgb1lxe/image/upload/v1750478085/4_wdyokm.png"
          alt="Challenge visual"
          className="mx-auto mb-6 w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl shadow-lg"
          {...fadeIn}
          transition={{ delay: 0.3 }}
        />
        <motion.div
          className="max-w-xl mx-auto mb-6 whitespace-pre-line"
          {...fadeIn}
          transition={{ delay: 0.4 }}
          dangerouslySetInnerHTML={{ __html: t.challengeQuestion_3 }}
        />

        <motion.div
          className="max-w-xl mx-auto mb-8 text-base sm:text-lg whitespace-pre-line"
          {...fadeIn}
          transition={{ delay: 0.5 }}
          dangerouslySetInnerHTML={{ __html: t.challengeMarketingBoost_3 }}
        />

        <motion.button
          onClick={() => {
            fbq('trackCustom', 'ChallengeCTA_Click');
            document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-[#4FC3F7] text-[#263238] text-lg font-semibold px-8 py-4 rounded-xl hover:brightness-110 hover:scale-105 transition shadow-lg mb-6 pulse-custom"
          {...fadeIn}
          transition={{ delay: 0.6 }}
        >
          {t.challengeCtaButton}
        </motion.button>

        <motion.h2
          className="text-2xl sm:text-3xl font-bold mt-2 mb-2 font-[Alexandria,sans-serif]"
          {...fadeIn}
          transition={{ delay: 0.8 }}
        >
          {t.challengeSubheadline_3}
        </motion.h2>
      </section>

      {/* What You Get */}
      <section className="pt-4 pb-8 px-6 max-w-4xl mx-auto text-left">
        <h2 className="text-2xl font-bold mb-6">{t.challengeWhatYouGetTitle}</h2>
        <ul className="space-y-8">
          <li>
            <p className="font-semibold">{t.challengeTip1Title}</p>
            <p dangerouslySetInnerHTML={{ __html: t.challengeTip1Desc }} />
          </li>
          <li>
            <p className="font-semibold">{t.challengeTip2Title}</p>
            <p dangerouslySetInnerHTML={{ __html: t.challengeTip2Desc }} />
          </li>
          <li>
            <p className="font-semibold">{t.challengeTip3Title}</p>
            <p dangerouslySetInnerHTML={{ __html: t.challengeTip3Desc }} />
          </li>
        </ul>
      </section>

      <motion.img
        src="https://res.cloudinary.com/dsqgb1lxe/image/upload/v1749521812/tim-mossholder-uROXq1PEQac-unsplash_fg0dti.jpg"
        alt="Hospitality example"
        className="mx-auto mb-2 rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl"
        {...fadeIn}
        transition={{ delay: 0.1 }}
      />

      {/* Who It's For */}
      <section className="py-12 px-6 max-w-4xl mx-auto text-left">
        <h2 className="text-2xl font-bold mb-8">{t.challengeWhoTitle}</h2>

        <motion.div
          className="grid grid-cols-1 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {[t.challengeWho1_3, t.challengeWho2, t.challengeWho3].map((item, idx) => (
            <Card key={idx} className="bg-gray-50 p-6 shadow-md hover:shadow-lg transition">
              <p className="text-gray-700 text-lg flex items-start gap-2">
                <span className="text-xl">🔹</span>
                <span>{item}</span>
              </p>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Why Subscribe */}
      <section className="py-4 px-6 max-w-4xl mx-auto text-left">
        <h2 className="text-2xl font-bold mb-6">{t.challengeWhyTitle}</h2>
        <ul className="space-y-4">
          <li dangerouslySetInnerHTML={{ __html: t.challengeWhy1_3 }} />
          <li dangerouslySetInnerHTML={{ __html: t.challengeWhy2 }} />
          <li dangerouslySetInnerHTML={{ __html: t.challengeWhy3 }} />
        </ul>
      </section>

{/* Signup Form Section */}
<section id="signup-form" className="py-16 px-6 bg-gray-50 text-center">
  <h2 className="text-2xl font-bold mb-4">{t.challengeSignupTitle}</h2>
  <p className="mb-6 max-w-xl mx-auto">{t.challengeSignupSubline_3}</p>

  {submitted ? (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md text-center">
      <h3 className="text-2xl font-bold text-[#1A237E] mb-4">Köszönjük, hogy feliratkoztál! 🎉</h3>
      <p className="text-lg text-gray-700">
        Az első e-mail néhány percen belül megérkezik a postaládádba.
        <br /> Kérlek, nézd meg a Promóciók vagy Spam mappát is, ha nem találod azonnal!
      </p>
    </div>
  ) : (
    <div
      className="max-w-xl mx-auto"
      dangerouslySetInnerHTML={{ __html: embedHtml }}
    />
  )}
</section>


      <Footer />
    </div>
  );
}