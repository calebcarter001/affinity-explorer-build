import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const HelpSupport = () => {
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [supportForm, setSupportForm] = useState({
    subject: 'General question',
    message: ''
  });

  const toggleFaq = (index) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Support request submitted:', supportForm);
    // Reset form after submission
    setSupportForm({
      subject: 'General question',
      message: ''
    });
  };

  const faqs = [
    {
      question: 'What are affinities?',
      answer: 'Affinities are scored attributes that represent different aspects or characteristics of properties and destinations. They help match travelers with the right accommodations based on their preferences.'
    },
    {
      question: 'How are affinity scores calculated?',
      answer: 'Affinity scores are calculated using a combination of first-party data, external sources, human verification, and algorithmic processing. The specific formula varies by affinity type.'
    },
    {
      question: 'How do I implement affinities in my product?',
      answer: 'Refer to the Implementation Guide section for detailed steps on how to integrate affinities into your product using our APIs.'
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Help & Support</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-3">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFaq(index)}
              >
                <h4 className="font-medium">{faq.question}</h4>
                {expandedFaqs[index] ? 
                  <FiChevronUp className="text-gray-500" /> : 
                  <FiChevronDown className="text-gray-500" />
                }
              </div>
              {expandedFaqs[index] && (
                <div className="mt-2">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Contact Support</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
            <select 
              name="subject"
              value={supportForm.subject}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
            >
              <option>General question</option>
              <option>API integration help</option>
              <option>Report an issue</option>
              <option>Feature request</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
            <textarea 
              name="message"
              value={supportForm.message}
              onChange={handleInputChange}
              rows="4" 
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500" 
              placeholder="Describe your question or issue..."
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HelpSupport;