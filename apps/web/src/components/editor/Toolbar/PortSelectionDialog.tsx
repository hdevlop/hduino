'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Usb, Check, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAdapter, type SerialPort } from '@hduino/platform';

interface PortSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPort: string | null;
  onPortSelect: (port: string) => void;
}

export function PortSelectionDialog({
  open,
  onOpenChange,
  currentPort,
  onPortSelect,
}: PortSelectionDialogProps) {
  const [selectedPort, setSelectedPort] = useState<string | null>(currentPort);
  const [ports, setPorts] = useState<SerialPort[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load ports when dialog opens
  useEffect(() => {
    if (open) {
      loadPorts();
    }
  }, [open]);

  // Update selected port when currentPort changes
  useEffect(() => {
    setSelectedPort(currentPort);
  }, [currentPort]);

  const loadPorts = async () => {
    setIsLoading(true);
    try {
      const adapter = getAdapter();
      const detectedPorts = await adapter.listPorts();
      setPorts(detectedPorts);
    } catch (error) {
      console.error('Failed to list ports:', error);
      setPorts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const adapter = getAdapter();
      const detectedPorts = await adapter.listPorts();
      setPorts(detectedPorts);
    } catch (error) {
      console.error('Failed to refresh ports:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSelect = () => {
    if (selectedPort) {
      onPortSelect(selectedPort);
      onOpenChange(false);
    }
  };

  const handlePortClick = (port: string) => {
    setSelectedPort(port);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Serial Port</DialogTitle>
          <DialogDescription>
            Choose a serial port to upload your Arduino code
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {/* Refresh button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="gap-2"
            >
              <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
              Refresh Ports
            </Button>
          </div>

          {/* Port list */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin opacity-50" />
                <p>Detecting serial ports...</p>
              </div>
            ) : ports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Usb className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No serial ports detected</p>
                <p className="text-sm mt-1">
                  Connect your Arduino board and click Refresh
                </p>
              </div>
            ) : (
              ports.map((port) => (
                <button
                  key={port.path}
                  onClick={() => handlePortClick(port.path)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg border-2 transition-all',
                    'flex items-center gap-3 text-left',
                    'hover:border-primary/50 hover:bg-accent/50',
                    selectedPort === port.path
                      ? 'border-primary bg-accent'
                      : 'border-border bg-card'
                  )}
                >
                  <div className="flex-shrink-0">
                    <Usb className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="font-medium">{port.path}</span>
                    {port.manufacturer && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground truncate">
                          {port.manufacturer}
                        </span>
                      </>
                    )}
                  </div>
                  {selectedPort === port.path && (
                    <div className="flex-shrink-0">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSelect}
            disabled={!selectedPort}
          >
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
