import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b pb-3 faq-item">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="font-medium">{question}</h4>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </div>
      <div className={`mt-2 text-gray-600 ${isOpen ? 'block' : 'hidden'}`}>
        {answer}
      </div>
    </div>
  );
};

const HelpSupport = () => {
  const faqs = [
    {
      question: "What are affinities?",
      answer: "Affinities are data-driven indicators that help identify specific characteristics or preferences associated with properties. They help match properties with target audiences more effectively."
    },
    {
      question: "How are affinity scores calculated?",
      answer: "Affinity scores are calculated using machine learning algorithms that analyze various data points including property features, guest reviews, booking patterns, and historical performance data."
    },
    {
      question: "How can I implement affinities in my product?",
      answer: "You can implement affinities using our REST API. Check the Implementation Guide tab for detailed instructions and code examples."
    },
    {
      question: "What's the validation process for new affinities?",
      answer: "New affinities go through a three-phase validation process: initial data analysis, enrichment, and final validation. You can track this process in the Lifecycle Tracker."
    }
  ];

  return (
    <div id="help-tab" className="tab-content">
      <h2 className="text-2xl font-bold mb-6">Help & Support</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Need More Help?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-3">
              <i className="fas fa-envelope text-expedia-blue text-xl mr-3"></i>
              <h4 className="font-medium">Email Support</h4>
            </div>
            <p className="text-gray-600 mb-3">
              Get help from our support team within 24 hours
            </p>
            <button className="text-expedia-blue hover:underline focus:outline-none">
              Send an email
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-3">
              <i className="fas fa-book text-expedia-blue text-xl mr-3"></i>
              <h4 className="font-medium">Documentation</h4>
            </div>
            <p className="text-gray-600 mb-3">
              Browse our detailed documentation and guides
            </p>
            <button className="text-expedia-blue hover:underline focus:outline-none">
              View docs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;