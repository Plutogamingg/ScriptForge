// AboutPage.js
import React from 'react';

const AboutPage = () => {
  return (
    <div>
      {/* About Us Header Section */}
      <section className="bg-gray-900 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold mb-4">ABOUT US</h2>
          <p className="mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        </div>
      </section>

      {/* Why We Are The Best Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold mb-4">WHY WE ARE THE BEST</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
          </div>
          <div className="flex flex-wrap -mx-4 text-center">
            {/* Placeholder for image blocks */}
            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-8">
              <div className="h-64 bg-gray-300 rounded-lg"></div>
              <h4 className="font-bold mt-3">Feature One</h4>
              <p className="mt-1">Description of feature one.</p>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-8">
              <div className="h-64 bg-gray-300 rounded-lg"></div>
              <h4 className="font-bold mt-3">Feature Two</h4>
              <p className="mt-1">Description of feature two.</p>
            </div>
            {/* ...more features */}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="bg-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center">
            <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
              <span className="text-6xl font-bold">100+</span>
              <p className="mt-1">Scripts Generated with AI</p>
            </div>
            {/* ...other stats */}
          </div>
        </div>
      </section>

      {/* Additional Sections */}
      {/* ... */}
    </div>
  );
};

export default AboutPage;
