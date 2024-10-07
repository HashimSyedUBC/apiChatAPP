import React, { useState } from 'react';
import './form.css';

const ModernCompanyForm = () => {
  const [formData, setFormData] = useState({
    companyEmail: '',
    companyName: '',
    companyNumber: '',
    briefDescription: '',
    documentationLink: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div id="company-form" className="form-container-form">
      <form onSubmit={handleSubmit} className="modern-form-form">
        <h2 className="form-title-form">Company <span className="highlight-form">Information</span></h2>
        
        <div className="form-field-form">
          <label htmlFor="companyEmail">Company Email</label>
          <input
            type="email"
            id="companyEmail"
            name="companyEmail"
            value={formData.companyEmail}
            onChange={handleChange}
            placeholder="email@company.com"
            required
          />
        </div>

        <div className="form-field-form">
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Your Company Name"
            required
          />
        </div>

        <div className="form-field-form">
          <label htmlFor="companyNumber">Company Number</label>
          <input
            type="text"
            id="companyNumber"
            name="companyNumber"
            value={formData.companyNumber}
            onChange={handleChange}
            placeholder="123456789"
            required
          />
        </div>

        <div className="form-field-form">
          <label htmlFor="briefDescription">Brief Description</label>
          <textarea
            id="briefDescription"
            name="briefDescription"
            value={formData.briefDescription}
            onChange={handleChange}
            placeholder="Briefly describe your company..."
            required
          ></textarea>
        </div>

        <div className="form-field-form">
          <label htmlFor="documentationLink">Company Documentation Link</label>
          <input
            type="url"
            id="documentationLink"
            name="documentationLink"
            value={formData.documentationLink}
            onChange={handleChange}
            placeholder="https://docs.yourcompany.com"
            required
          />
        </div>

        <button type="submit" className="submit-button-form">Submit</button>
      </form>
    </div>
  );
};

export default ModernCompanyForm;
