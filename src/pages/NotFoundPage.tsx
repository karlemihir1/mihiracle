import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-24 text-center space-y-4">
      <Compass className="w-12 h-12 text-brand-muted mx-auto" />
      <h1 className="font-serif text-2xl font-bold text-brand-navy dark:text-white">
        Page Not Found
      </h1>
      <p className="text-xs text-brand-muted max-w-sm mx-auto">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button
        variant="primary"
        size="sm"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Return Home
      </Button>
    </div>
  );
};
