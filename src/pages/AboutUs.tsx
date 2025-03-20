
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Briefcase, Globe, Clock, Award } from 'lucide-react';

export default function AboutUs() {
  const { t } = useLanguage();

  const stats = [
    { value: '10+', label: 'Years of Experience', icon: Clock },
    { value: '200+', label: 'Happy Clients', icon: Briefcase },
    { value: '20+', label: 'Countries Served', icon: Globe },
    { value: '50+', label: 'Industry Awards', icon: Award },
  ];

  const team = [
    {
      name: 'Alex Morgan',
      position: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
      description: 'With over 15 years of experience in international finance and business registration, Alex leads our company with expertise and vision.'
    },
    {
      name: 'Sarah Johnson',
      position: 'Legal Director',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      description: 'Sarah oversees all legal aspects of our company, ensuring top-quality service and legal compliance for all clients.'
    },
    {
      name: 'Michael Chen',
      position: 'Financial Consultant',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
      description: 'Michael specializes in international banking and helps clients navigate complex financial requirements.'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                About Fintech<span className="text-fintech-orange">Assist</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Your trusted partner in business registration, banking, and financial licensing worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-2xl overflow-hidden">
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095" 
                    alt="Our office" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0">
                    <GlowingEffect 
                      blur={2} 
                      spread={30} 
                      glow={true} 
                      disabled={false} 
                      inactiveZone={0.4}
                      proximity={60}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
                  <span className="flex h-2 w-2 rounded-full bg-fintech-blue mr-2"></span>
                  Our Story
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  A Decade of Excellence in Financial Solutions
                </h2>
                <p className="text-muted-foreground mb-6">
                  Founded in 2013, Fintech-Assist has grown from a small consultancy to a global leader in business registration and financial services. Our journey began with a simple mission: to make international business operations accessible to entrepreneurs worldwide.
                </p>
                <p className="text-muted-foreground mb-6">
                  Today, we serve clients across 20+ countries, providing seamless solutions for company registration, bank account opening, and financial licensing. Our team of experts combines local knowledge with global expertise to deliver exceptional results.
                </p>
                <p className="text-muted-foreground">
                  We pride ourselves on our personalized approach, transparency, and commitment to client success. Whether you're a startup or an established business, we have the solutions to help you grow and thrive globally.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover-scale"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-fintech-blue/10 dark:bg-fintech-blue/20 rounded-lg text-fintech-blue dark:text-fintech-blue-light">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-3xl font-display font-bold text-fintech-blue dark:text-fintech-blue-light mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
                <span className="flex h-2 w-2 rounded-full bg-fintech-blue mr-2"></span>
                Our Team
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Meet the Experts Behind Fintech-Assist
              </h2>
              <p className="text-xl text-muted-foreground">
                Our team combines expertise in finance, law, and international business to deliver exceptional solutions for our clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover-scale"
                >
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold mb-1">{member.name}</h3>
                    <p className="text-fintech-blue dark:text-fintech-blue-light mb-4">{member.position}</p>
                    <p className="text-muted-foreground">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
