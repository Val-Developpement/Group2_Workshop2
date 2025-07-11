'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const services = [
  {
    id: 'garderie',
    title: 'Garderie d\'Animaux',
    color: 'blue',
    image: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=600&q=80', // Deux petits chiens ensemble, ambiance garderie
    description: "Un espace sécurisé et ludique pour vos animaux, avec jeux, promenades et surveillance professionnelle.",
    stripe_product_id: 'prod_Sf07P1ywPWBT2B',
    prices: [
      { label: 'Jour', value: '250 AED', price: 250, stripe_price_id: 'price_1Rjg7UPZx6VQhfzi1Hlik7N3', desc: 'Idéal pour une garde ponctuelle ou une journée d\'activité.' },
      { label: 'Semaine', value: '1500 AED', price: 1500, stripe_price_id: 'price_1Rjg7UPZx6VQhfziZpLchWEK', desc: 'Pour une semaine complète de jeux et de soins.' },
      { label: 'Mois', value: '5000 AED', price: 5000, stripe_price_id: 'price_1Rjg7UPZx6VQhfzipvUmLFeS', desc: 'Parfait pour les séjours prolongés ou les besoins réguliers.' },
      { label: 'Année', value: '48000 AED', price: 48000, stripe_price_id: 'price_1Rjg7UPZx6VQhfzizfVFmrzq', desc: 'La solution économique pour une tranquillité d\'esprit toute l\'année.' },
    ],
    location: 'Dubai',
  },
  {
    id: 'spa',
    title: 'Spa pour Animaux',
    color: 'lime',
    image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=600&q=80', // Chien et chat détendus, bien-être
    description: "Offrez à votre compagnon un moment de détente : toilettage, massages et soins bien-être.",
    stripe_product_id: 'prod_Sf09p4Ld8ISWrB',
    prices: [
      { label: '30 min', value: '400 AED', price: 400, stripe_price_id: 'price_1Rjg8oPZx6VQhfzi3bFJdba6', desc: 'Soin express pour une petite pause bien-être.' },
      { label: '1h', value: '700 AED', price: 700, stripe_price_id: 'price_1Rjg98PZx6VQhfzi12QYKDhZ', desc: 'Massage complet et relaxation profonde.' },
      { label: '2h', value: '1200 AED', price: 1200, stripe_price_id: 'price_1Rjg9JPZx6VQhfziY0XZ54A3', desc: 'Programme spa complet avec soins personnalisés.' },
      { label: '3h', value: '1800 AED', price: 1800, stripe_price_id: 'price_1Rjg9TPZx6VQhfzihbEbTS3J', desc: 'Le summum du bien-être pour votre animal.' },
    ],
    location: 'Dubai',
  },
  {
    id: 'hotel',
    title: 'Hôtel pour Chien Deluxe',
    color: 'amber',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=80', // Chien dans un lit/cadre luxueux, ambiance hôtel
    description: "Séjour 5 étoiles pour chiens : suites climatisées, promenades sur la plage, room service et webcam live.",
    stripe_product_id: 'prod_Sf0B1W0QUIXEmH',
    prices: [
      { label: 'Jour', value: '800 AED', price: 800, stripe_price_id: 'price_1RjgAiPZx6VQhfzi3E71FYvX', desc: 'Pour un week-end ou une courte escapade à Dubaï.' },
      { label: 'Semaine', value: '5000 AED', price: 5000, stripe_price_id: 'price_1RjgAzPZx6VQhfziHAU2xzAl', desc: 'Une semaine de luxe et de confort pour votre chien.' },
      { label: 'Mois', value: '18000 AED', price: 18000, stripe_price_id: 'price_1RjgBCPZx6VQhfzisuFCx4N7', desc: 'Un séjour prolongé avec tous les services inclus.' },
      { label: 'Année', value: '200000 AED', price: 200000, stripe_price_id: 'price_1RjgBPPZx6VQhfzihVGCiuhz', desc: 'Le summum du confort et du luxe pour votre chien toute l\'année.' },
    ],
    location: 'Dubai',
  },
];

export default function Services() {
  const { addItem } = useCart();

  // Scroll vers la section
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddToCart = (service: any, priceOption: any) => {
    addItem({
      id: `${service.id}-${priceOption.label.toLowerCase().replace(/\s+/g, '-')}`,
      name: `${service.title} - ${priceOption.label}`,
      price: priceOption.price,
      image_url: service.image,
      stripe_product_id: service.stripe_product_id,
      stripe_price_id: priceOption.stripe_price_id,
    });
    toast.success(`${service.title} - ${priceOption.label} ajouté au panier !`);
  };

  return (
    <main className="min-h-screen py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="mt-8 text-4xl md:text-5xl font-bold mb-10 text-black">Nos Services à Dubaï</h1>
        <p className="text-lg text-gray-700 mb-12">
          Découvrez nos offres premium pour le bien-être de vos animaux à Dubaï : garderie, spa et hôtel deluxe pour chiens. Tarifs flexibles selon la durée.
        </p>
        {/* Barre de navigation catégories déplacée ici */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleScroll(service.id)}
              className={`px-5 py-2 rounded-full font-semibold shadow transition text-white text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${service.color}-400 ${
                service.color === 'blue'
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : service.color === 'lime'
                  ? 'bg-lime-500 hover:bg-lime-600'
                  : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>
        <div className="space-y-16">
          {services.map((service, idx) => (
            <section
              key={idx}
              id={service.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-10 text-left flex flex-col items-center"
            >
              {/* Image de la catégorie */}
              {service.image && (
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full max-w-xs h-40 object-cover rounded-xl mb-6 shadow"
                  style={{background: '#f3f4f6'}}
                />
              )}
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 ${
                  service.color === 'blue'
                    ? 'bg-blue-100'
                    : service.color === 'lime'
                    ? 'bg-lime-100'
                    : 'bg-amber-100'
                }`}
              >
                <svg
                  className={`w-7 h-7 ${
                    service.color === 'blue'
                      ? 'text-blue-600'
                      : service.color === 'lime'
                      ? 'text-lime-600'
                      : 'text-amber-600'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M8 12h8" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 8v8" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h2
                className={`text-3xl font-semibold mb-2 text-center ${
                  service.color === 'blue'
                    ? 'text-blue-800'
                    : service.color === 'lime'
                    ? 'text-lime-800'
                    : 'text-amber-800'
                }`}
              >
                {service.title}
              </h2>
              <p className="text-gray-700 mb-6 text-center max-w-xl">{service.description}</p>
              <div className="flex flex-col md:flex-row gap-6 justify-center w-full mb-4">
                {service.prices.map((p, i) => (
                  <div
                    key={i}
                    className={`flex-1 bg-gradient-to-br from-gray-50 to-${service.color}-50 border-t-4 ${
                      service.color === 'blue'
                        ? 'border-blue-400'
                        : service.color === 'lime'
                        ? 'border-lime-400'
                        : 'border-amber-400'
                    } rounded-xl shadow p-6 flex flex-col items-center`}
                  >
                    <div className="text-lg font-bold mb-2 text-gray-700">{p.label}</div>
                    <div className="text-2xl font-extrabold mb-1 text-gray-900">{p.value}</div>
                    <div className="text-xs text-gray-500 mb-2">{service.location}</div>
                    <div className="text-xs text-gray-600 text-center mb-4">{p.desc}</div>
                    <button
                      onClick={() => handleAddToCart(service, p)}
                      className={`mt-auto px-4 py-2 rounded font-semibold shadow transition text-white w-full ${
                        service.color === 'blue'
                          ? 'bg-blue-500 hover:bg-blue-600'
                          : service.color === 'lime'
                          ? 'bg-lime-500 hover:bg-lime-600'
                          : 'bg-amber-500 hover:bg-amber-600'
                      }`}
                    >
                      Ajouter au panier
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

