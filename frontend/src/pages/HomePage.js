// HomePage.js
import React from 'react';
import Layout from './Layout'; // Assume Layout contains the Navigation

const HomePage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="text-center bg-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <p className="text-sm font-semibold mb-2">Lorem ipsum dolor sit amet...</p>
            <h1 className="text-5xl font-bold leading-tight mb-4">FORGE YOUR STORIES TOGETHER.</h1>
            <p className="mb-6">Ut enim ad minim veniam...</p>
          </div>
          <div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">LOGIN</button>
          </div>
          <p className="font-medium mt-4">TOGETHER WE SUCCEED</p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
              {/* Placeholder for an image */}
              <div className="h-64 bg-gray-300 rounded-lg"></div>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-6">
              <h2 className="text-3xl font-bold mb-4">ABOUT US</h2>
              <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full">MORE</button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Sections */}
      {/* ... */}
    </Layout>
  );
};

export default HomePage;
