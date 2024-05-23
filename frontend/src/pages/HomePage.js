import React from 'react';

const HomePage = () => {
  return (
    <>
      {/* Hero Section with TailwindCSS, custom colors from Dashboard, and specific background styles */}
      <section className="text-center py-20 bg-gray-800 text-white" style={{ background: 'linear-gradient(135deg, #0F0F28 100%, #050506 0%)', backgroundRepeat: 'no-repeat' }}>
        <div className="container mx-auto px-4">
          <p className="text-sm font-semibold mb-2 text-yellow-400">Lorem ipsum dolor sit amet...</p>
          <h1 className="text-5xl font-bold leading-tight mb-4 text-white">FORGE YOUR STORIES TOGETHER.</h1>
          <p className="mb-6 text-gray-400">Ut enim ad minim veniam...</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full">LOGIN</button>
          <p className="font-medium mt-4 text-teal-300">TOGETHER WE SUCCEED</p>
        </div>
      </section>

      {/* About Section with TailwindCSS and custom colors */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
              <div className="h-64 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/path-to-your-about-image.jpg" alt="About Us" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-6">
              <h2 className="text-3xl font-bold mb-4 text-orange-500">ABOUT US</h2>
              <p className="mb-4 text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
              <button className="bg-teal-300 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded-full">MORE</button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional TailwindCSS Styled Sections */}
      {/* You can add more sections as required, following the same styling patterns */}
    </>
  );
};

export default HomePage;
