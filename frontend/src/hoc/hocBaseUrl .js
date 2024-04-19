import React from 'react';

// I define the base URLs for accessing my application's backend services
const domainBaseURL = 'https://my-domain.com/';
const localBaseURL = 'http://localhost:8000/';

/**
 * This HOC enhances a component with logic to select the base URL for API calls.
 * I use it to automatically try the production domain first and fallback to localhost if the domain isn't accessible.
 * It’s particularly handy for testing my app in different environments without changing the code.
 * 
 * @param {React.Component} WrappedComponent - The component I want to enhance with base URL logic.
 * @returns {React.Component} - The same component but now with a 'baseUrl' prop for making API calls.
 */
const hocBaseUrl = (WrappedComponent) => {
  return class extends React.Component {
    state = {
      baseUrl: domainBaseURL  // I start with the assumption that my domain URL is accessible
    };

    componentDidMount() {
      // I check if the domain URL is accessible by making a fetch call to a known endpoint
      fetch(domainBaseURL + 'admin-interface/iamapi/')  // This endpoint should always be up if my domain is working
        .then(response => {
          if (!response.ok) throw new Error('Domain not available');
          // Domain is accessible, so I keep the state as is
        })
        .catch(() => {
          // If there's an error, like a network issue, I switch to localhost
          console.error('Domain failed. Using localhost.');
          this.setState({ baseUrl: localBaseURL });
        });
    }

    render() {
      // I pass the base URL and any other props down to the WrappedComponent
      return <WrappedComponent {...this.props} baseUrl={this.state.baseUrl} />;
    }
  };
};

export default hocBaseUrl;

// Here's how I use it:
// In the component file where I need to make API calls:
/*
import React from 'react';
import hocBaseUrl from './hocBaseUrl'; // I ensure this path is correct based on where I've stored the HOC

function MyComponent({ baseUrl }) {
  // Now I can use the baseUrl prop to make API calls specific to my component
  return (
    <div>
      const apiEndpoint = 'admin-interface/iamapi/specific-endpoint';
      const fullUrl = `${baseUrl}${apiEndpoint}`;
    </div>
  );
}

// I wrap MyComponent with hocBaseUrl to inject the baseUrl prop automatically
export default hocBaseUrl(MyComponent);
*/
