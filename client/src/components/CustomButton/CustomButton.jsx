import { useState } from 'react';
import "./CustomButton.scss";

const API_BASE_URL = 'http://localhost:3000/api';

function CustomButton({
  label,
  path,
  method = "GET",
  body = null,
  onSuccess = null,
  onError = null,
  requireAuth = false,
  onClick = null,
  disabled = false,
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    // Eğer dışarıdan onClick verildiyse, API isteği yapma, sadece onu çalıştır
    if (onClick) {
      if (disabled || loading) return;
      onClick();
      return;
    }

    if (!path) {
      console.error('CustomButton: path prop is required for API request');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // If authentication is required and token is not present, throw an error
      if (requireAuth && !token) {
        throw new Error('Authentication required');
      }

      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      const requestOptions = {
        method: method.toUpperCase(),
        headers
      };

      // Add body
      if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
        requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      }
      
      // eklendi
      const url = `${API_BASE_URL}${path}`;

      const response = await fetch(url, requestOptions);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        if (onSuccess) {
          onSuccess(data, response);
        }
      } else {
        const error = data?.message || data?.error || `Request failed with status ${response.status}`;
        if (onError) {
          onError(error, response, data);
        } else {
          console.error('API Error:', error);
        }
      }
    } catch (error) {
      if (onError) {
        onError(error.message, null, null);
      } else {
        console.error('API Request Error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`custom-button ${loading ? 'loading' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
    >
      {loading ? 'Loading...' : label}
    </div>
  );
}

export default CustomButton;
