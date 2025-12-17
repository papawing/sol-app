import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/shared/Navbar';
import { ArrowLeft } from 'lucide-react';

export default function BecomeCastPage() {
  const t = useTranslations();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#222222] tracking-tight mb-6">
              Become a Cast
            </h1>
            <p className="text-xl text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed">
              Join our exclusive network of high-class professionals
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-[1rem] p-8 shadow-[0_2px_4px_rgba(0,0,0,0.08),_0_4px_12px_rgba(0,0,0,0.05)] mb-8">
            <h2 className="text-2xl font-semibold text-[#222222] mb-4">
              Application Process
            </h2>
            <p className="text-[#6B6B6B] mb-6 leading-relaxed">
              We carefully select cast members who embody sophistication, professionalism, and discretion.
              Our application process ensures the highest quality experiences for our members.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FF5A5F] to-[#E61E4D] text-white flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-[#222222] mb-1">Submit Application</h3>
                  <p className="text-[#6B6B6B] text-sm">Complete our confidential application form with your details and photos.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FF5A5F] to-[#E61E4D] text-white flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-[#222222] mb-1">Interview Process</h3>
                  <p className="text-[#6B6B6B] text-sm">Meet with our team for a personal interview and verification.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#FF5A5F] to-[#E61E4D] text-white flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-[#222222] mb-1">Profile Creation</h3>
                  <p className="text-[#6B6B6B] text-sm">Work with us to create your exclusive profile for our members.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/register">
                <Button variant="airbnb" size="lg">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-gray-50 rounded-[1rem] p-8">
            <h2 className="text-2xl font-semibold text-[#222222] mb-4">
              Requirements
            </h2>
            <ul className="space-y-2 text-[#6B6B6B]">
              <li className="flex items-start">
                <span className="text-[#FF5A5F] mr-2">•</span>
                <span>Professional appearance and sophisticated demeanor</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5A5F] mr-2">•</span>
                <span>Excellent communication skills in multiple languages</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5A5F] mr-2">•</span>
                <span>Commitment to discretion and confidentiality</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5A5F] mr-2">•</span>
                <span>Available for premium bookings and events</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
