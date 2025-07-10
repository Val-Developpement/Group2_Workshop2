import Link from 'next/link';
import { Button } from './ui/button';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-3xl font-extrabold text-white mb-6">
              <span className="text-4xl">🐾</span>
              <span style={{fontFamily: 'var(--font-caveat)'}}>APwAP</span>
            </Link>
            <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
              Une vision globale du bien-être physique et émotionnel de votre animal de compagnie. 
              Nous considérons l'unicité de chaque couple humain-animal pour des recommandations personnalisées.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="group">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full group-hover:bg-lime-500 transition-colors">
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
              </a>
              <a href="#" className="group">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full group-hover:bg-lime-500 transition-colors">
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </div>
              </a>
              <a href="#" className="group">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full group-hover:bg-lime-500 transition-colors">
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.754-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </div>
              </a>
              <a href="#" className="group">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full group-hover:bg-lime-500 transition-colors">
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.956-.11-.949-.21-2.4.04-3.441.226-.939 1.45-6.14 1.45-6.14s-.371-.742-.371-1.838c0-1.721.997-3.006 2.239-3.006 1.055 0 1.565.793 1.565 1.744 0 1.063-.677 2.651-1.026 4.121-.292 1.234.619 2.237 1.834 2.237 2.202 0 3.895-2.323 3.895-5.681 0-2.966-2.133-5.04-5.18-5.04-3.527 0-5.596 2.647-5.596 5.386 0 1.067.407 2.214.916 2.835.1.122.115.229.085.353-.092.388-.302 1.24-.343 1.412-.055.233-.179.281-.413.17-1.544-.719-2.512-2.978-2.512-4.803 0-3.91 2.845-7.508 8.203-7.508 4.304 0 7.653 3.075 7.653 7.174 0 4.28-2.699 7.723-6.444 7.723-1.258 0-2.443-.65-2.849-1.426l-.774 2.958c-.281 1.081-1.038 2.435-1.544 3.259C9.966 23.815 11.212 24.009 12.5 24.009c6.355 0 11.5-5.146 11.5-11.509C24 5.896 18.855.75 12.5.75z"/>
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Navigation</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-gray-300 hover:text-lime-400 transition-colors flex items-center group">
                  <svg className="w-4 h-4 mr-2 text-lime-500 group-hover:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-lime-400 transition-colors flex items-center group">
                  <svg className="w-4 h-4 mr-2 text-lime-500 group-hover:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-lime-400 transition-colors flex items-center group">
                  <svg className="w-4 h-4 mr-2 text-lime-500 group-hover:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Nos services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-lime-400 transition-colors flex items-center group">
                  <svg className="w-4 h-4 mr-2 text-lime-500 group-hover:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact & Support</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-lime-500 rounded-full flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Email</p>
                  <a href="mailto:contact@apetwithaplan.com" className="text-white hover:text-lime-400 transition-colors">
                    contact@apetwithaplan.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-lime-500 rounded-full flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Téléphone</p>
                  <a href="tel:+33123456789" className="text-white hover:text-lime-400 transition-colors">
                    +33 1 23 45 67 89
                  </a>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-300 leading-relaxed">
                  <svg className="w-4 h-4 text-lime-500 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Nous sommes soumis au secret professionnel et garantissons la plus grande discrétion.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h4 className="text-lg font-bold text-white mb-2">Newsletter</h4>
              <p className="text-gray-300">Recevez nos conseils et actualités directement dans votre boîte mail</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1  px-4 mr-2 bg-gray-800 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-lime-500"
              />
              <Button className="bg-lime-500 hover:bg-lime-600 text-white ">
                S'abonner
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 A Pet with a Plan. Tous droits réservés.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-lime-400 text-sm transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-lime-400 text-sm transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-lime-400 text-sm transition-colors">
                Gestion des cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 