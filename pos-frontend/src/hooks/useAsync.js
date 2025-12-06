import { useState } from 'react';
import { showError, showSuccess } from '../utils/toast';

export const useAsync = (asyncFunction, immediate = true) => {
  const [state, setState] = useState({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await asyncFunction();
      if (response.success) {
        setState({ data: response.data, loading: false, error: null });
        if (response.message) {
          showSuccess(response.message);
        }
      } else {
        setState({ data: null, loading: false, error: response.message });
        showError(response.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      showError(errorMessage);
    }
  };

  return { execute, ...state };
};
