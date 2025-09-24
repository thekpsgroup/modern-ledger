export type Testimonial = {
  name: string;
  company?: string;
  city?: string;
  role?: string;
  rating: 1|2|3|4|5;
  quote: string;
  source: "Google";
  date?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Bailey Motes",
    rating: 5,
    quote:
      "Absolutely love this company! Karson has been the biggest help getting me on track for a great future in business. Flexible hours and cost to accommodate all business types and sizes! So very thankful for them.",
    source: "Google",
    city: "Royse City, TX",
    date: "22 weeks ago"
  },
  {
    name: "Amy Nguyen",
    company: "Urban Designs KC",
    rating: 5,
    quote:
      "The KPS Group was incredibly helpful! Karson took the time to understand our needs and helped modernize our tools, marketing, and accounting systems. Super knowledgeable, easy to work with, and genuinely cares about helping businesses grow. Highly recommend!",
    source: "Google",
    city: "DFW, TX",
    date: "22 weeks ago"
  },
  {
    name: "Amber Smith",
    rating: 5,
    quote: "Karson is professional and committed to his business!",
    source: "Google",
    city: "Royse City, TX",
    date: "30 weeks ago"
  },
  {
    name: "Adam Farmer",
    role: "Local Guide",
    rating: 5,
    quote:
      "Top notch consulting and bookkeeping services. Penny Joy Consulting was a game changer for my small business. Highly recommend.",
    source: "Google",
    city: "Rockwall County, TX",
    date: "30 weeks ago"
  },
  {
    name: "Brandon & Holly Gibson",
    rating: 5,
    quote: "An amazing consultant for our growing business!",
    source: "Google",
    city: "Royse City, TX",
    date: "30 weeks ago"
  }
];