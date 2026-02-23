import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function PublicidadSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const slides = [
    {
      image: '/images/pub1.jpg', // Cambia por tu imagen
      title: '¡Envíos discretos a toda Colombia!',
      description: 'Tu privacidad es nuestra prioridad.',
    },
    {
      image: '/images/pub2.jpg', // Cambia por tu imagen
      title: 'Descubre la nueva colección de lencería exclusiva',
      description: 'Diseños únicos para realzar tu sensualidad.',
    },
    {
      image: '/images/pub3.jpg', // Cambia por tu imagen
      title: 'Oferta especial: 20% off en juguetes',
      description: 'Aprovecha nuestras promociones limitadas.',
    },
  ];

  return (
    <section className="bg-gradient-to-r from-black to-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-80 md:h-96 object-cover rounded-lg"
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
