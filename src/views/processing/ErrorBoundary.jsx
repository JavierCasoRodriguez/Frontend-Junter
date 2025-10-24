// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', marginTop: '50px',border:'1px solid whitesmoke',borderRadius:'8px'}}>
          <h1 style={{fontFamily:'Lexend',fontSize:'20px'}}>There has been a problem on the app</h1>
          <p>{this.state.error.message}</p>
          <h1 style={{fontFamily:'Lexend',fontSize:'15px'}}>We are checking, soon the error will be fixed!</h1>
          
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
