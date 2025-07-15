import React from 'react';
import { motion } from 'framer-motion';
import '../components/harrypotter.css'; // import custom CSS for fonts and theming

const LandingPageMagic = () => {

  return (
    <div className="harry-bg text-gold">
      {/* Hero Section */}
      <section
        className="bg-center text-white py-32"
        style={{ backgroundImage: `url('/hogwarts-bg.jpg')`, backgroundSize: 'cover' }}
      >
        <motion.div
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-hp font-bold mb-4 drop-shadow-lg">
            Welcome to Your Magical Learning Journey
          </h1>
          <p className="text-xl mb-6 font-hp drop-shadow-sm">
            Enchanted courses, wizard-level recommendations, and more—your Hogwarts of Knowledge awaits.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-gold text-maroon px-8 py-3 rounded-full text-lg font-hp font-medium hover:bg-yellow-300 transition"
          >
            Begin Your Quest
          </a>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-maroon text-gold">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-hp font-bold text-center mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Unlock Wizarding Wisdom
          </motion.h2>

          <motion.p
            className="text-center font-hp max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Whether you're a Muggle or a magical mind, our enchanted platform uses AI sorcery to guide your growth.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Sorting Hat Suggestions',
                text: 'Let our AI Sorting Hat match you to the right courses for your magical potential.',
              },
              {
                title: 'Ministry Missions',
                text: 'Track magical internships and quests via enchanted web scraping spells.',
              },
              {
                title: 'Wizard Dashboard',
                text: 'Your personal Room of Requirement—organize spells, progress, and saved tomes.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-yellow-100 text-maroon p-6 rounded-2xl shadow-lg text-center font-hp"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p>{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-20 bg-cover bg-fixed"
        style={{ backgroundImage: "url('/great-hall.jpg')" }}
      >
        <div className="container mx-auto px-4 text-center backdrop-blur-sm bg-maroon/80 rounded-xl py-10 text-gold">
          <motion.h2
            className="text-4xl font-hp font-bold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Hear from the Hogwarts Council
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Hermione Granger',
                role: 'Witch of Wisdom',
                quote: 'This platform made even Muggle Studies fascinating! Brilliant enchantments!',
              },
              {
                name: 'Harry Potter',
                role: 'Auror',
                quote: 'A proper magical guide—helped me train like Dumbledore himself!',
              },
              {
                name: 'Ron Weasley',
                role: 'Gryffindor Keeper',
                quote: 'Blimey, this thing’s brilliant—like magic without the wand!'
,
              },
            ].map((user, index) => (
              <motion.div
                key={user.name}
                className="bg-gold text-maroon p-6 rounded-lg shadow-md font-hp"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <p className="mb-4 italic">"{user.quote}"</p>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm">{user.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gold text-maroon py-10 font-hp">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">&copy; 2025 Hogwarts Learning Companion. All spells reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:underline">Wizarding Policy</a>
            <a href="#" className="hover:underline">Terms of Enchantment</a>
            <a href="#" className="hover:underline">Owl Mail</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageMagic;
