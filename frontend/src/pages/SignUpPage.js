// SignUpPage.js
import React from 'react';


const SignUpPage = () => {
  return (
    <>
      {/* Header with Gradient */}
      <header
        className="p-5"
        style={{
          background: "linear-gradient(135deg, #0F0F28 100%, #050506 0%)",
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <a href="#" className="text-white text-lg">Page1</a>
            <a href="#" className="text-white text-lg">Page2</a>
            <a href="#" className="text-white text-lg">Page3</a>
            <a href="#" className="text-white text-lg">Page4</a>
          </div>
          <a href="#" className="text-orange-custom-400 text-lg">LOGIN</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen" style={{
        background: "linear-gradient(135deg, #0F0F28 40%, #050506 60%)",
        backgroundRepeat: 'no-repeat',
      }}>
        {/* Sign Up Section */}
        <div className="w-full max-w-lg px-6 py-12 text-center">
          <h2 className="text-5xl font-bold text-white mb-6"> <span style= {{color: '#FFA32C'}} >SIGN </span><span style= {{color: '#0BF1B7'}}>UP</span></h2>
          {/* Other content */}
        </div>
        {/* The rest of your content */}
      
        {/* Sign Up Section */}
        <div className="w-full bg-off-white py-6">
        <div className="text-center">
  <h2 className="text-3xl text-orange-400 font-bold">BENEFITS OF SIGNING UP</h2>
  <p className="mt-4 mb-8 max-w-lg mx-auto text-black 300">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  <button className="bg-orange-400 p-2 rounded-full inline-flex items-center justify-center" style={{ width: '75x', height: '50px' }}>
    <span className="text-black text-3xl">↓</span>
  </button>
</div>
</div>

        <form className="w-full max-w-lg bg-black p-8 bg-transparent flex justify-center flex-wrap">

         
          
          <div className="mb-6 w-full">
            <input type="email" id="email" className="form-input bg-transparent border-b-2 border-green-500 text-white w-full focus:outline-none focus:border-green-600 text-center" placeholder="Email" />
          </div>
          <div className="mb-6 w-full">
            <input type="tel" id="contact-number" className="form-input bg-transparent border-b-2 border-green-500 text-white w-full focus:outline-none focus:border-green-600 text-center" placeholder="Contact Number" />
          </div>
          <div className="mb-6 w-full">
            <input type="password" id="password" className="form-input bg-transparent border-b-2 border-green-500 text-white w-full focus:outline-none focus:border-green-600 text-center" placeholder="Password" />
          </div>
          <div className="mb-8 w-full">
            <input type="password" id="confirm-password" className="form-input bg-transparent border-b-2 border-green-500 text-white w-full focus:outline-none focus:border-green-600 text-center" placeholder="Confirm Password" />
          </div>
          <button type="submit" className="w-250 text-black font-bold py-3 px-4 rounded-full bg-orange-500 hover:bg-orange-600 focus:outline-none focus:shadow-outline">
            SIGN UP
          </button>
        </form>
      </main>
    </>
  );
};

export default SignUpPage;
