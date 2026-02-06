'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCoreManager } from '@/hooks/useCoreManager';
import {
  Loader2,
  Download,
  Check,
  Package,
  Search,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle,
} from 'lucide-react';
import type { CoreInfo } from '@hduino/platform';

interface BoardManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Popular cores that users might want to install
const POPULAR_CORES = [
  { id: 'arduino:avr', name: 'Arduino AVR Boards', description: 'UNO, Nano, Mega, Leonardo' },
  { id: 'esp32:esp32', name: 'ESP32', description: 'ESP32, ESP32-S2, ESP32-C3' },
  { id: 'esp8266:esp8266', name: 'ESP8266', description: 'NodeMCU, Wemos D1' },
  { id: 'arduino:samd', name: 'Arduino SAMD', description: 'Zero, MKR series' },
  { id: 'arduino:megaavr', name: 'Arduino megaAVR', description: 'Nano Every, UNO WiFi Rev2' },
];

export function BoardManagerDialog({ open, onOpenChange }: BoardManagerDialogProps) {
  const {
    isLoading,
    isInstalling,
    installedCores,
    bundledCores,
    error,
    cliAvailable,
    cliVersion,
    isDesktop,
    refresh,
    installCore,
    searchCores,
    isInstalled,
    isBundled,
  } = useCoreManager();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CoreInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [installingCore, setInstallingCore] = useState<string | null>(null);

  // Refresh when dialog opens
  useEffect(() => {
    if (open && isDesktop) {
      refresh();
    }
  }, [open, isDesktop, refresh]);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchCores(searchQuery);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle core installation
  const handleInstall = async (coreId: string) => {
    setInstallingCore(coreId);
    try {
      await installCore(coreId);
    } finally {
      setInstallingCore(null);
    }
  };

  // Show web-only message
  if (!isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Board Manager</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <WifiOff className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Board management is only available in the desktop app.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Download the desktop app to install additional board cores.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Board Manager
          </DialogTitle>
        </DialogHeader>

        {/* CLI Status */}
        <div className="flex items-center justify-between text-sm border-b pb-3">
          <div className="flex items-center gap-2">
            {cliAvailable ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">
                  Arduino CLI {cliVersion}
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-destructive">Arduino CLI not found</span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Search for boards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Search Results</h3>
              <div className="space-y-2">
                {searchResults.map((core) => (
                  <CoreCard
                    key={core.id}
                    core={core}
                    isInstalled={isInstalled(core.id)}
                    isBundled={isBundled(core.id)}
                    isInstalling={installingCore === core.id}
                    onInstall={() => handleInstall(core.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Installed Cores */}
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              Installed Cores
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </h3>
            {installedCores.length === 0 && !isLoading ? (
              <p className="text-sm text-muted-foreground">
                No cores installed. Install Arduino AVR to get started.
              </p>
            ) : (
              <div className="space-y-2">
                {installedCores.map((core) => (
                  <CoreCard
                    key={core.id}
                    core={core}
                    isInstalled={true}
                    isBundled={isBundled(core.id)}
                    isInstalling={false}
                    onInstall={() => {}}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Popular Cores */}
          <div>
            <h3 className="font-medium mb-2">Popular Cores</h3>
            <div className="space-y-2">
              {POPULAR_CORES.map((core) => (
                <div
                  key={core.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {core.name}
                      {isBundled(core.id) && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          Bundled
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {core.description}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {core.id}
                    </div>
                  </div>
                  <div>
                    {isInstalled(core.id) ? (
                      <Button variant="outline" size="sm" disabled>
                        <Check className="h-4 w-4 mr-1" />
                        Installed
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleInstall(core.id)}
                        disabled={isInstalling || installingCore !== null}
                      >
                        {installingCore === core.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-1" />
                        )}
                        Install
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Individual core card component
function CoreCard({
  core,
  isInstalled,
  isBundled,
  isInstalling,
  onInstall,
}: {
  core: CoreInfo;
  isInstalled: boolean;
  isBundled: boolean;
  isInstalling: boolean;
  onInstall: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div>
        <div className="font-medium flex items-center gap-2">
          {core.name}
          {isBundled && (
            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              Offline
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {core.id} • v{core.installed || core.latest}
        </div>
      </div>
      <div>
        {isInstalled ? (
          <Button variant="outline" size="sm" disabled>
            <Check className="h-4 w-4 mr-1" />
            Installed
          </Button>
        ) : (
          <Button size="sm" onClick={onInstall} disabled={isInstalling}>
            {isInstalling ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-1" />
            )}
            Install
          </Button>
        )}
      </div>
    </div>
  );
}
