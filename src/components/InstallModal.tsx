import { useState } from "react";
import { X, Download, Smartphone, Monitor, Share, Plus, Check } from "lucide-react";

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isNativePromptAvailable: boolean;
}

export default function InstallModal({ isOpen, onClose, onInstall, isNativePromptAvailable }: InstallModalProps) {
  const [activeTab, setActiveTab] = useState<"ios" | "android" | "desktop">("ios");
  const [imgError, setImgError] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn" id="pwa-install-modal">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-amber-500/5 relative animate-scaleIn">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Download className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">Install ForensiCV</h3>
              <p className="text-[11px] text-slate-400">Add to your Home Screen for full app experience</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800/50 rounded-lg border border-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-950/50 border border-slate-850 p-4 rounded-xl flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-500/30 shadow-md shrink-0 bg-slate-900 flex items-center justify-center relative select-none flex-shrink-0">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black text-lg tracking-tight">
                F
              </div>
              {!imgError && (
                <img 
                  src="/icon.png" 
                  alt="ForensiCV PWA Logo" 
                  className="w-full h-full object-cover z-10"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-200">ForensiCV Web Application</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Unlock instant resume auditing, biometric timeline screening, and offline AI chat companions directly from your mobile dock or desktop.
              </p>
            </div>
          </div>

          {isNativePromptAvailable ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 text-center">
                Your browser supports one-click installation. Click the button below to install immediately!
              </p>
              <button
                onClick={() => {
                  onInstall();
                  onClose();
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 transform active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>INSTALL APP NOW</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Tab Selector */}
              <div className="flex gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-850">
                <button
                  onClick={() => setActiveTab("ios")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                    activeTab === "ios" 
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>iOS (Safari)</span>
                </button>
                <button
                  onClick={() => setActiveTab("android")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                    activeTab === "android" 
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Android (Chrome)</span>
                </button>
                <button
                  onClick={() => setActiveTab("desktop")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                    activeTab === "desktop" 
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
              </div>

              {/* Instructions Tab Panels */}
              {activeTab === "ios" && (
                <div className="space-y-3.5 animate-fadeIn">
                  <div className="flex gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center font-mono text-[10px] shrink-0 border border-slate-700">1</span>
                    <p className="text-slate-300 leading-relaxed pt-0.5">
                      Open <span className="font-semibold text-slate-100">Safari Browser</span> and tap the <span className="inline-flex items-center gap-1 bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-amber-400 border border-slate-700"><Share className="w-3 h-3 inline" /> Share</span> button in the navigation bar.
                    </p>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center font-mono text-[10px] shrink-0 border border-slate-700">2</span>
                    <p className="text-slate-300 leading-relaxed pt-0.5">
                      Scroll down through the shared options list and tap <span className="font-semibold text-slate-100">“Add to Home Screen”</span>.
                    </p>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center font-mono text-[10px] shrink-0 border border-slate-700">3</span>
                    <p className="text-slate-300 leading-relaxed pt-0.5">
                      Tap <span className="font-semibold text-slate-100 text-amber-400">“Add”</span> in the top-right corner to pin the high-performance app icon to your phone!
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "android" && (
                <div className="space-y-3.5 animate-fadeIn">
                  <div className="flex gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center font-mono text-[10px] shrink-0 border border-slate-700">1</span>
                    <p className="text-slate-300 leading-relaxed pt-0.5">
                      Tap the <span className="font-semibold text-slate-100">Three Dots Menu (⋮)</span> in the top right-hand corner of Chrome.
                    </p>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center font-mono text-[10px] shrink-0 border border-slate-700">2</span>
                    <p className="text-slate-300 leading-relaxed pt-0.5">
                      Select <span className="font-semibold text-slate-100">“Install App”</span> or <span className="font-semibold text-slate-100">“Add to Home screen”</span>.
                    </p>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center font-mono text-[10px] shrink-0 border border-slate-700">3</span>
                    <p className="text-slate-300 leading-relaxed pt-0.5">
                      Follow the prompts to add the application, allowing background synchronization and faster load speeds.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "desktop" && (
                <div className="space-y-3.5 animate-fadeIn">
                  <div className="flex gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center font-mono text-[10px] shrink-0 border border-slate-700">1</span>
                    <p className="text-slate-300 leading-relaxed pt-0.5">
                      Look at the right side of your browser's address bar (URL bar).
                    </p>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center font-mono text-[10px] shrink-0 border border-slate-700">2</span>
                    <p className="text-slate-300 leading-relaxed pt-0.5">
                      Click the <span className="font-semibold text-slate-100 text-amber-400">“Install” or Monitor icon</span> next to the bookmark star.
                    </p>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center font-mono text-[10px] shrink-0 border border-slate-700">3</span>
                    <p className="text-slate-300 leading-relaxed pt-0.5">
                      Confirm install to add it as a standalone app on your Dock, Taskbar, or Applications menu!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-850/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>PWA Verified</span>
          </span>
          <span>Requires iOS 11.3+ / Android Chrome</span>
        </div>
      </div>
    </div>
  );
}
