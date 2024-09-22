import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

const App = () => {
  const [jsonData, setJsonData] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState(null);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' },
  ];

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(jsonData); 

      
      const response = await axios.post('http://localhost:5000/bfhl', {
        data: parsedData.data,
        file_b64: parsedData.file_b64 || '',
      });

      setResponseData(response.data); 
      setError(null); 
    } catch (err) {
      setError('Invalid JSON or error occurred');
      setResponseData(null); 
    }
  };

  
  const renderCompleteResponse = () => {
    if (!responseData) return null;

    return (
      <div className="complete-response">
        <h3>Response:</h3>
        <div><strong>Success:</strong> {responseData.is_success ? 'Yes' : 'No'}</div>
        <div><strong>User ID:</strong> {responseData.user_id}</div>
        <div><strong>Email:</strong> {responseData.email}</div>
        <div><strong>Roll Number:</strong> {responseData.roll_number}</div>
        <div><strong>Numbers:</strong> {responseData.numbers.join(', ')}</div>
        <div><strong>Alphabets:</strong> {responseData.alphabets.join(', ')}</div>
        <div><strong>Highest Lowercase Alphabet:</strong> {responseData.highest_lowercase_alphabet.join(', ')}</div>
        <div><strong>File Valid:</strong> {responseData.file_valid ? 'Yes' : 'No'}</div>
        <div><strong>File MIME Type:</strong> {responseData.file_mime_type}</div>
        <div><strong>File Size (KB):</strong> {responseData.file_size_kb}</div>
      </div>
    );
  };

  
  const renderFilteredResponse = () => {
    if (!responseData) return null;

    return (
      <div className="response-section">
        {selectedOptions.includes('alphabets') && (
          <div>
            <strong>Alphabets: </strong>{' '}
            {responseData.alphabets.length > 0 ? responseData.alphabets.join(', ') : 'None'}
          </div>
        )}
        {selectedOptions.includes('numbers') && (
          <div>
            <strong>Numbers: </strong>{' '}
            {responseData.numbers.length > 0 ? responseData.numbers.join(', ') : 'None'}
          </div>
        )}
        {selectedOptions.includes('highest_lowercase_alphabet') && (
          <div>
            <strong>Highest Lowercase Alphabet: </strong>{' '}
            {responseData.highest_lowercase_alphabet.length > 0 ? responseData.highest_lowercase_alphabet.join(', ') : 'None'}
          </div>
        )}
      </div>
    );
  };

  
  const handleSelectChange = (selected) => {
    setSelectedOptions(selected.map((option) => option.value));
  };

  
  document.title = "RA2111003010567";

  return (
    <div className="App">
      <h1>API Response Display</h1>

      <form onSubmit={handleSubmit} className="json-form">
        <textarea
          className="json-input"
          rows="3"
          cols="50"
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder='{"data":["M","1","334","4","B"]}'
        />
        <br />
        <button type="submit" className="submit-btn">Submit</button>
      </form>

      
      {error && <p className="error-message">{error}</p>}

      
      {responseData && (
        <div className="dropdown-section">
          <h3>Multi Filter</h3>
          <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
            className="dropdown"
          />
        </div>
      )}

      {renderCompleteResponse()}

      {responseData && (
        <div className="filtered-response">
          <h3>Filtered Response</h3>
          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
};

export default App;
