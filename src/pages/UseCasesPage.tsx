import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Utensils, Scissors, Coffee, Building2, Store, Space as Spa } from 'lucide-react';
import Footer from '../components/Footer';
import PublicNavBar from '../components/PublicNavBar';
import { useLanguage } from '../context/LanguageContext';

const useCasesPageTranslations = {
  en: {
    hero_title: 'Who is Review to Revenue for?',
    hero_subtitle: 'Built for small and medium-sized physical businesses that want more reviews, more visibility, and more customers through gamified feedback collection.',
    cta_title: 'Ready to turn reviews into revenue?',
    cta_subtitle: 'Start your free 14-day trial. No credit card needed.',
    cta_button: 'Get Started Free',
    learn_more: 'Learn more →',
    cases: {
      restaurants: {
        title: 'Restaurants',
        benefit: 'Turn satisfied diners into 5-star ambassadors',
        description: 'Capture reviews right after the perfect meal, when satisfaction is highest. Reward loyal customers and bring them back for more.',
      },
      barbershops: {
        title: 'Barbershops',
        benefit: 'Boost local trust with real-time reviews',
        description: 'Convert great cuts into instant social proof. Build a reputation that keeps your chairs full.',
      },
      cafes: {
        title: 'Cafés',
        benefit: 'Get found by tourists and locals alike',
        description: 'Turn your regulars into your best marketers. Stand out in local search results with authentic reviews.',
      },
      hotels: {
        title: 'Hotels & Guesthouses',
        benefit: 'Convert great stays into lasting visibility',
        description: 'Capture reviews at checkout when memories are fresh. Build trust with future guests through authentic feedback.',
      },
      retail: {
        title: 'Retail Shops',
        benefit: 'Build reputation at checkout',
        description: 'Turn happy customers into vocal advocates. Increase local visibility and attract more foot traffic.',
      },
      salons: {
        title: 'Salons & Spas',
        benefit: 'Highlight your service quality online',
        description: 'Transform relaxed clients into enthusiastic reviewers. Showcase your expertise through customer testimonials.',
      },
    }
  },
  hu: {
    hero_title: 'Kiknek szól a Review to Revenue?',
    hero_subtitle: 'Kifejezetten fizikális üzlettel rendelkező kis- és középvállalkozásoknak, akik több véleményt, nagyobb láthatóságot és több vásárlót szeretnének szerezni játékos értékelésgyűjtéssel.',
    cta_title: 'Készen állsz, hogy a véleményekből bevétel legyen?',
    cta_subtitle: 'Indítsd el az ingyenes 14 napos próbaidőszakot – nincs szükség bankkártyára.',
    cta_button: 'Kezdd el ingyen',
    learn_more: 'Tudj meg többet →',
    cases: {
      restaurants: {
        title: 'Étterem',
        benefit: 'Váltsd a jóllakott vendégeket 5 csillagos nagykövetekké',
        description: 'Gyűjts véleményeket közvetlenül az étkezés után – amikor a vendég a legelégedettebb. Jutalmazd őket és hozd vissza őket újra!',
      },
      barbershops: {
        title: 'Fodrászat',
        benefit: 'Építs helyi bizalmat valós időben érkező értékelésekkel',
        description: 'A jó frizura egy kattintásra van a Google-tól – alakítsd a jó élményt értékeléssé és visszatérő vendégekké.',
      },
      cafes: {
        title: 'Kávézó',
        benefit: 'Legyél látható a helyiek és a turisták számára is',
        description: 'A törzsvendégeid lehetnek a legjobb marketingeseid. Emelkedj ki a Google térképen valódi véleményekkel.',
      },
      hotels: {
        title: 'Szálláshely',
        benefit: 'Fordítsd a kellemes tartózkodást tartós láthatósággá',
        description: 'Kérj értékelést kijelentkezéskor, amikor még frissek az élmények. Nyerj elismerést a jövőbeli vendégektől.',
      },
      retail: {
        title: 'Kiskereskedelem',
        benefit: 'Építs hírnevet közvetlenül a pénztárnál',
        description: 'A boldog vásárlók a legjobb szószólóid. Növeld a helyi ismertséged és a boltba érkező forgalmat.',
      },
      salons: {
        title: 'Szépségszalon',
        benefit: 'Emeld ki a szolgáltatásaid minőségét online',
        description: 'A relaxált vendégek szívesen hagynak visszajelzést – mutasd meg szakértelmed valós véleményeken keresztül.',
      },
    }
  }
};

export default function UseCasesPage() {
  const { language } = useLanguage();
  const t = useCasesPageTranslations[language];

  const useCases = [
    {
      icon: Utensils,
      title: t.cases.restaurants.title,
      benefit: t.cases.restaurants.benefit,
      description: t.cases.restaurants.description,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
      link: "/use-cases/restaurants"
    },
    {
      icon: Scissors,
      title: t.cases.barbershops.title,
      benefit: t.cases.barbershops.benefit,
      description: t.cases.barbershops.description,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80",
      link: "/use-cases/barbershops"
    },
    {
      icon: Coffee,
      title: t.cases.cafes.title,
      benefit: t.cases.cafes.benefit,
      description: t.cases.cafes.description,
      color: "text-brown-600",
      bgColor: "bg-amber-50",
      imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
      link: "/use-cases/cafes"
    },
    {
      icon: Building2,
      title: t.cases.hotels.title,
      benefit: t.cases.hotels.benefit,
      description: t.cases.hotels.description,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
      link: "/use-cases/hotels"
    },
    {
      icon: Store,
      title: t.cases.retail.title,
      benefit: t.cases.retail.benefit,
      description: t.cases.retail.description,
      color: "text-green-600",
      bgColor: "bg-green-50",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
      link: "/use-cases/retail"
    },
    {
      icon: Spa,
      title: t.cases.salons.title,
      benefit: t.cases.salons.benefit,
      description: t.cases.salons.description,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      imageUrl: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=80",
      link: "/use-cases/salons"
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t.hero_title}
            </h1>
            <p className="text-xl text-gray-600">
              {t.hero_subtitle}
            </p>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${useCase.bgColor} rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-all`}
              >
                {/* Image */}
                <img
                  src={useCase.imageUrl}
                  alt={useCase.title}
                  className="w-full h-40 object-cover"
                />

                {/* Content */}
                <div className="p-8">
                  <div className={`inline-flex p-3 rounded-lg ${useCase.bgColor} ${useCase.color} mb-4`}>
                    <useCase.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-lg font-medium text-gray-800 mb-3">
                    {useCase.benefit}
                  </p>
                  <p className="text-gray-600">
                    {useCase.description}
                  </p>
                  <Link
                    to={useCase.link}
                    className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                  >
                    {t.learn_more}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">{t.cta_title}</h2>
          <p className="text-xl text-blue-100 mb-8">{t.cta_subtitle}</p>
          <Link
            to="https://reviewtorevenue.io/auth"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold text-lg
                     hover:bg-blue-50 transform transition-all hover:scale-105 shadow-lg"
          >
            {t.cta_button}
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}