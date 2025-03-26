
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <span className="inline-block text-9xl font-display font-bold text-fintech-blue">404</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Страница не найдена</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-10">
            Похоже, вы перешли по неверной ссылке. Возможно, страница была перемещена или удалена.
          </p>
          <Button asChild size="lg" className="animate-pulse">
            <Link to="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться на главную
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NotFound;
