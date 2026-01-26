'use client';

import { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import Button from '@/components/UI/Button';

interface PreviewFrameProps {
  children: React.ReactNode;
}

export default function PreviewFrame({ children }: PreviewFrameProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="h-full flex flex-col">
      {/* Device Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          type="button"
          variant={deviceMode === 'desktop' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setDeviceMode('desktop')}
        >
          <Monitor className="h-4 w-4 mr-1" />
          Desktop
        </Button>
        <Button
          type="button"
          variant={deviceMode === 'mobile' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setDeviceMode('mobile')}
        >
          <Smartphone className="h-4 w-4 mr-1" />
          Mobile
        </Button>
      </div>

      {/* Preview Container */}
      <div className="flex-1 flex items-start justify-center overflow-auto">
        <div
          className={`bg-white rounded-lg shadow-lg transition-all duration-300 ${
            deviceMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-4xl'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
