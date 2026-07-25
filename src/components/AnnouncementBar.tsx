import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const messageKeys = ["freeShipping", "discount", "newUser"];
const STORAGE_KEY = "xurts_announcement_dismissed_v1";

export const AnnouncementBar = () => {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const id = setInterval(() => setIndex((value) => (value + 1) % messageKeys.length), 5000);
    return () => clearInterval(id);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="relative bg-foreground text-background">
      <div className="container-full">
        <div className="flex items-center justify-center gap-3 py-2.5 text-[11px] tracking-[0.15em] uppercase min-h-[36px]">
          <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
          <div className="relative overflow-hidden h-4 flex-1 max-w-xl text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
              >
                {t(messageKeys[index])}
              </motion.p>
            </AnimatePresence>
          </div>
          <button onClick={() => { localStorage.setItem(STORAGE_KEY, "1"); setDismissed(true); }} aria-label={t("dismissAnnouncement")} className="p-1 hover:bg-background/10 transition-colors flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
