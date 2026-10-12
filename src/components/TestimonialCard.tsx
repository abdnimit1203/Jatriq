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
    <div className="bg-stone-50 border border-stone-200/90 rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
            ))}
          </div>
          <Quote className="w-6 h-6 text-stone-300 shrink-0" />
        </div>

        <p className="text-stone-700 text-sm sm:text-base leading-relaxed italic mb-6">
          “{getText(testimonial.quote)}”
        </p>
      </div>

      <div className="pt-4 border-t border-stone-200/60">
        <h4 className="font-bold text-stone-900 text-sm">
          {getText(testimonial.name)}
        </h4>
        <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5">
          <span>{getText(testimonial.location)}</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-800 font-medium truncate">
            {getText(testimonial.trip)}
          </span>
        </div>
      </div>
    </div>
  );
};
