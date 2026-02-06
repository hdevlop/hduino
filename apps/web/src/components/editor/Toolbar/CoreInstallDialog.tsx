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
import { useCoreManager } from '@/hooks/useCoreManager';
import {
  Loader2,
  Download,
  AlertTriangle,
  Check,
  Wifi,
} from 'lucide-react';

interface CoreInstallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardFqbn: string;
  boardName: string;
  onInstallComplete?: () => void;
}

// Map board FQBN to core info
const CORE_INFO: Record<string, { id: string; name: string; description: string }> = {
  'arduino:avr': {
    id: 'arduino:avr',
    name: 'Arduino AVR Boards',
    description: 'Required for Arduino UNO, Nano, Mega, Leonardo, and other AVR-based boards.',
  },
  'esp32:esp32': {
    id: 'esp32:esp32',
    name: 'ESP32 Boards',
    description: 'Required for ESP32, ESP32-S2, ESP32-C3, and other ESP32 variants.',
  },
  'esp8266:esp8266': {
    id: 'esp8266:esp8266',
    name: 'ESP8266 Boards',
    description: 'Required for NodeMCU, Wemos D1, and other ESP8266-based boards.',
  },
  'arduino:samd': {
    id: 'arduino:samd',
    name: 'Arduino SAMD Boards',
    description: 'Required for Arduino Zero, MKR series, and other SAMD-based boards.',
  },
};

function getCoreIdFromFqbn(fqbn: string): string {
  const parts = fqbn.split(':');
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return fqbn;
}

export function CoreInstallDialog({
  open,
  onOpenChange,
  boardFqbn,
  boardName,
  onInstallComplete,
}: CoreInstallDialogProps) {
  const { installCore, checkCoreStatus, isBundled, isDesktop } = useCoreManager();
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [installError, setInstallError] = useState<string | null>(null);
  const [coreStatus, setCoreStatus] = useState<{
    coreId: string;
    installed: boolean;
    bundled: boolean;
  } | null>(null);

  const coreId = getCoreIdFromFqbn(boardFqbn);
  const coreInfo = CORE_INFO[coreId];

  // Check core status when dialog opens
  useEffect(() => {
    if (open && isDesktop) {
      checkCoreStatus(boardFqbn).then(setCoreStatus);
      setInstallSuccess(false);
      setInstallError(null);
    }
  }, [open, boardFqbn, checkCoreStatus, isDesktop]);

  const handleInstall = async () => {
    setIsInstalling(true);
    setInstallError(null);

    try {
      const success = await installCore(coreId);
      if (success) {
        setInstallSuccess(true);
        // Notify parent that installation is complete
        onInstallComplete?.();
      }
    } catch (error) {
      setInstallError(error instanceof Error ? error.message : 'Installation failed');
    } finally {
      setIsInstalling(false);
    }
  };

  // If already installed, show success and close
  if (coreStatus?.installed && !installSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Core Already Installed
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            The {coreInfo?.name || coreId} core is already installed. You can proceed with uploading.
          </p>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Installation success
  if (installSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Installation Complete
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {coreInfo?.name || coreId} has been installed successfully. You can now upload to your {boardName}.
          </p>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Core Required
          </DialogTitle>
          <DialogDescription>
            The board "{boardName}" requires additional software to be installed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Core info */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="font-medium flex items-center gap-2">
              {coreInfo?.name || coreId}
              {isBundled(coreId) && (
                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Wifi className="h-3 w-3" />
                  Works Offline
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {coreInfo?.description || `Required for ${boardName}`}
            </p>
            <div className="text-xs text-muted-foreground font-mono mt-2">
              {coreId}
            </div>
          </div>

          {/* Error message */}
          {installError && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {installError}
            </div>
          )}

          {/* Install info */}
          <p className="text-sm text-muted-foreground">
            This will download and install the required compiler and libraries.
            The download size is approximately 150-300 MB depending on the board type.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isInstalling}
          >
            Cancel
          </Button>
          <Button onClick={handleInstall} disabled={isInstalling}>
            {isInstalling ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Installing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Install Now
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
