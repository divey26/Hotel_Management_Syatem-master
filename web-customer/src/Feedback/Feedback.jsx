
import React from 'react';

const FeedbackForm = () => {
  const containerStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const formGroupStyle = {
    marginBottom: '15px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ccc',
    color: '#333',
    marginRight: '10px',
  };

  const submitButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#333',
    color: '#fff',
  };

  return (
    <div style={containerStyle}>
      <h1>Hello, Give Your feedback Here</h1>
      <form>
        <div style={formGroupStyle}>
          <input style={inputStyle} type="text" placeholder="Enter Name" />
        </div>
        <div style={formGroupStyle}>
          <input style={inputStyle} type="email" placeholder="Enter Email" />
        </div>
        <div style={formGroupStyle}>
          <input style={inputStyle} type="text" placeholder="Enter Subject" />
        </div>
        <div style={formGroupStyle}>
          <textarea style={inputStyle} placeholder="Enter the message"></textarea>
        </div>
        <div style={formGroupStyle}>
          <button style={cancelButtonStyle} type="button">
            Cancel
          </button>
          <button style={submitButtonStyle} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;