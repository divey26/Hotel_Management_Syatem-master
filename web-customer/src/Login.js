import React, { useState } from 'react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    checkInDate: '',
    checkOutDate: '',
    cleanlinessRating: '',
    staffFriendlinessRating: '',
    amenitiesRating: '',
    comments: '',
    suggestions: ''
  });

  const [nameError, setNameError] = useState('');

  const containerStyle = {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    position: 'relative', // Add position relative for positioning the tooltip
  };

  const formGroupStyle = {
    marginBottom: '15px',
    position: 'relative', // Add position relative for positioning the tooltip
  };

  const labelStyle = {
    marginBottom: '5px',
    display: 'block',
    fontWeight: 'bold',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    boxSizing: 'border-box',
    marginBottom: '10px',
  };

  const textareaStyle = {
    ...inputStyle,
    height: '100px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '10px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transition: 'background-color 0.3s ease',
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement submission logic here
    console.log(formData);
    // Reset form data after submission if needed
    setFormData({
      name: '',
      email: '',
      checkInDate: '',
      checkOutDate: '',
      cleanlinessRating: '',
      staffFriendlinessRating: '',
      amenitiesRating: '',
      comments: '',
      suggestions: ''
    });
  };

  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(name);
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    if (validateName(value) || value === '') {
      setFormData({
        ...formData,
        name: value
      });
      setNameError('');
    } else {
      setNameError('Please enter a valid name without symbols or numbers.');
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Give Your Feedback Here</h1>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Name:</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            required
          />
          {nameError && (
            <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'red', color: '#fff', padding: '5px 10px', borderRadius: '6px' }}>
              {nameError}
            </div>
          )}
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Email:</label>
          <input
            style={inputStyle}
            type="email"
            placeholder="Enter Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Check-in Date:</label>
          <input
            style={inputStyle}
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Check-out Date:</label>
          <input
            style={inputStyle}
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Cleanliness Rating:</label>
          <input
            style={inputStyle}
            type="number"
            min="1"
            max="5"
            placeholder="Enter rating (1-5)"
            name="cleanlinessRating"
            value={formData.cleanlinessRating}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Staff Friendliness Rating:</label>
          <input
            style={inputStyle}
            type="number"
            min="1"
            max="5"
            placeholder="Enter rating (1-5)"
            name="staffFriendlinessRating"
            value={formData.staffFriendlinessRating}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Amenities Rating:</label>
          <input
            style={inputStyle}
            type="number"
            min="1"
            max="5"
            placeholder="Enter rating (1-5)"
            name="amenitiesRating"
            value={formData.amenitiesRating}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Comments:</label>
          <textarea
            style={textareaStyle}
            placeholder="Enter comments"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Suggestions for Improvement:</label>
          <textarea
            style={textareaStyle}
            placeholder="Suggestions for improvement"
            name="suggestions"
            value={formData.suggestions}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button
            style={{ ...buttonStyle, backgroundColor: '#ccc', color: '#333' }}
            type="button"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0E46A3'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ccc'}
          >
            Cancel
          </button>
          <button
            style={{ ...buttonStyle, backgroundColor: '#333', color: '#fff' }}
            type="submit"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0E46A3'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#333'}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
