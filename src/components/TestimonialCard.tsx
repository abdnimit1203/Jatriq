import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TestimonialProps {
  testimonial: {
    id: string;
    name: { bn: string; en: string };
    location: { bn: string; en: string };
    trip: { bn: string; en: string };
    quote: { bn: string; en: string };
    rating: number;
  };
}

export const TestimonialCard: React.FC<TestimonialProps> = ({ testimonial }) => {
  const { getText } = useLanguage();

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-amber-500">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="w-4.5 h-4.5 fill-amber-400 stroke-amber-400" />
            ))}
          </div>
          <Quote className="w-7 h-7 text-stone-300/80 shrink-0" />
        </div>

        <p className="text-stone-700 text-base sm:text-lg leading-relaxed italic mb-6">
          “{getText(testimonial.quote)}”
        </p>
      </div>

      <div className="pt-4 border-t border-stone-100">
        <h4 className="font-bold text-stone-900 text-base sm:text-lg">
          {getText(testimonial.name)}
        </h4>
        <div className="text-xs sm:text-sm text-stone-500 mt-1 flex items-center gap-2">
          <span>{getText(testimonial.location)}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="text-emerald-800 font-bold truncate">
            {getText(testimonial.trip)}
          </span>
        </div>
      </div>
    </div>
  );
};
