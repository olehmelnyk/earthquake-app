'use client';

import { useEffect } from 'react';
import { Button } from '@earthquake-app/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-bold">Something went wrong!</h2>
        <p className="text-xl text-muted-foreground">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Button
          onClick={() => reset()}
          variant="default"
          className="mt-4"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}