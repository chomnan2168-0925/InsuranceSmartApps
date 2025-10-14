import React from "react";
import Link from "next/link";
import SEO from "@/components/layout/SEO";
import dynamic from "next/dynamic";

// Disable SSR for PuzzleGame to prevent hydration mismatch
const PuzzleGame = dynamic(() => import("@/components/ui/PuzzleGame"), { ssr: false });

const Custom404Page = () => {
  return (
    <>
      <SEO title="404 Fun!" />

      <div className="text-center py-10 md:py-16 px-4 bg-gray-50 min-h-screen flex flex-col justify-start">
        <div className="max-w-6xl mx-auto w-full">

          {/* Top playful warning */}
          <h2 className="text-lg md:text-xl text-gray-500 italic mb-14">
            Oops! Looks like you wandered off the trail 🚧
          </h2>

          {/* Big playful hook */}
          <h1 className="text-3xl md:text-6xl font-extrabold text-gold leading-snug drop-shadow-sm mb-4">
            But hey!!! <br />welcome to our secret playground! 🎠
          </h1>

          {/* Game Section */}
          <div className="mt-12 max-w-4xl mx-auto w-full">
            <PuzzleGame />
          </div>

          {/* Home Section */}
          <div className="mt-12 border-t pt-8">
            <h3 className="text-2xl font-bold text-navy-blue">Let’s Go Home</h3>
            <p className="mt-1 text-xl text-gray-600">Or explore some of our most useful sections below.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Link
                href="/insurance-tips"
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <h4 className="font-bold text-xl -mt-1 text-navy-blue">Insurance Tips</h4>
                <p className="text-md text-gray-600 mt-1">Actionable advice to help you save.</p>
              </Link>
              <Link
                href="/calculators"
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <h4 className="font-bold text-xl -mt-1 text-navy-blue">Smart Calculators</h4>
                <p className="text-md text-gray-600 mt-1">Plan your finances with our tools.</p>
              </Link>
              <Link
                href="/newsroom"
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <h4 className="font-bold text-xl -mt-1 text-navy-blue">Latest News</h4>
                <p className="text-md text-gray-600 mt-1">Stay updated with insurance news.</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom404Page;
