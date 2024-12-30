import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 sticky bottom-0">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div>
          <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-200">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-200">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-200">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;