import { useState, useCallback } from 'react';
import { ApolloError } from '@apollo/client';

export interface ErrorState {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Custom hook for handling GraphQL and other errors in a consistent way
 */
export const useErrorHandling = () => {
  const [error, setError] = useState<ErrorState | null>(null);

  /**
   * Process an Apollo error into a user-friendly format
   */
  const handleApolloError = useCallback((apolloError: ApolloError) => {
    // Extract the most relevant error information
    const graphQLErrors = apolloError.graphQLErrors?.[0];
    const networkError = apolloError.networkError;
    
    let errorMessage = 'An error occurred';
    let errorCode;
    let errorDetails = {};
    
    if (graphQLErrors) {
      // Handle GraphQL-specific errors
      errorMessage = graphQLErrors.message || 'GraphQL error occurred';
      errorCode = graphQLErrors.extensions?.code as string;
      errorDetails = graphQLErrors.extensions || {};
    } else if (networkError) {
      // Handle network errors (e.g., server down, CORS issues)
      errorMessage = 'Network error: Please check your connection';
      if ('statusCode' in networkError) {
        errorCode = `NETWORK_${networkError.statusCode}`;
      }
    }
    
    setError({
      message: errorMessage,
      code: errorCode,
      details: errorDetails
    });
    
    return {
      message: errorMessage,
      code: errorCode,
      details: errorDetails
    };
  }, []);
  
  /**
   * Clear any existing error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  /**
   * Set a custom error message
   */
  const setCustomError = useCallback((message: string, code?: string, details?: Record<string, unknown>) => {
    setError({ message, code, details });
  }, []);
  
  return {
    error,
    handleApolloError,
    clearError,
    setCustomError
  };
};

/**
 * Utility for extracting user-friendly messages from GraphQL errors
 */
export const getErrorMessage = (error: ApolloError | Error | unknown): string => {
  if (!error) return 'An unknown error occurred';
  
  // Handle Apollo errors
  if (error instanceof ApolloError) {
    const graphQLError = error.graphQLErrors?.[0];
    if (graphQLError) return graphQLError.message;
    if (error.networkError) return 'Network error: Please check your connection';
    return error.message;
  }
  
  // Handle regular errors
  if (error instanceof Error) {
    return error.message;
  }
  
  // Fallback for unknown error types
  return 'An unexpected error occurred';
};
