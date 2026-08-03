import { Ruler } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/i18n/LanguageContext";

interface SizeGuideProps {
  collection: string;
}

// Fashion (clothing) size chart — measurements in cm
const fashionRows = [
  { size: "XS", chest: "86 – 90", waist: "70 – 74", hips: "88 – 92" },
  { size: "S", chest: "91 – 95", waist: "75 – 79", hips: "93 – 97" },
  { size: "M", chest: "96 – 100", waist: "80 – 84", hips: "98 – 102" },
  { size: "L", chest: "101 – 106", waist: "85 – 90", hips: "103 – 108" },
  { size: "XL", chest: "107 – 112", waist: "91 – 96", hips: "109 – 114" },
];

// Sepatu size conversion
const shoeRows = [
  { eu: "39", us: "6.5", uk: "5.5", cm: "24.5" },
  { eu: "40", us: "7", uk: "6", cm: "25.0" },
  { eu: "41", us: "8", uk: "7", cm: "25.5" },
  { eu: "42", us: "9", uk: "8", cm: "26.5" },
  { eu: "43", us: "10", uk: "9", cm: "27.5" },
  { eu: "44", us: "10.5", uk: "9.5", cm: "28.0" },
  { eu: "45", us: "11.5", uk: "10.5", cm: "29.0" },
];

export const SizeGuide = ({ collection }: SizeGuideProps) => {
  const { t } = useLanguage();
  const isShoe = collection === "sepatu";
  const isFashion = collection === "fashion";
  const defaultTab = isShoe ? "shoes" : "fashion";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          <Ruler className="w-3.5 h-3.5" />
          {t("sizeGuideButton")}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-none">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">{t("sizeGuideTitle")}</DialogTitle>
          <DialogDescription className="text-xs tracking-[0.1em] uppercase text-muted-foreground">
            {t("sizeGuideDescription")}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="mt-2">
          <TabsList className="rounded-none bg-muted/50 mb-6">
            {(isFashion || (!isShoe && !isFashion)) && (
              <TabsTrigger value="fashion" className="rounded-none text-xs tracking-[0.15em] uppercase">
                {t("sizeGuideFashion")}
              </TabsTrigger>
            )}
            {(isShoe || (!isShoe && !isFashion)) && (
              <TabsTrigger value="shoes" className="rounded-none text-xs tracking-[0.15em] uppercase">
                {t("sizeGuideShoes")}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="fashion" className="space-y-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] tracking-[0.15em] uppercase">{t("sizeGuideSize")}</TableHead>
                  <TableHead className="text-[11px] tracking-[0.15em] uppercase">{t("sizeGuideChest")}</TableHead>
                  <TableHead className="text-[11px] tracking-[0.15em] uppercase">{t("sizeGuideWaist")}</TableHead>
                  <TableHead className="text-[11px] tracking-[0.15em] uppercase">{t("sizeGuideHips")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fashionRows.map((r) => (
                  <TableRow key={r.size}>
                    <TableCell className="font-medium">{r.size}</TableCell>
                    <TableCell>{r.chest}</TableCell>
                    <TableCell>{r.waist}</TableCell>
                    <TableCell>{r.hips}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5 pt-2">
              <p>{t("sizeGuideChestDesc")}</p>
              <p>{t("sizeGuideWaistDesc")}</p>
              <p>{t("sizeGuideHipsDesc")}</p>
            </div>
          </TabsContent>

          <TabsContent value="shoes" className="space-y-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] tracking-[0.15em] uppercase">{t("sizeGuideEu")}</TableHead>
                  <TableHead className="text-[11px] tracking-[0.15em] uppercase">{t("sizeGuideUs")}</TableHead>
                  <TableHead className="text-[11px] tracking-[0.15em] uppercase">{t("sizeGuideUk")}</TableHead>
                  <TableHead className="text-[11px] tracking-[0.15em] uppercase">{t("sizeGuideLength")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shoeRows.map((r) => (
                  <TableRow key={r.eu}>
                    <TableCell className="font-medium">{r.eu}</TableCell>
                    <TableCell>{r.us}</TableCell>
                    <TableCell>{r.uk}</TableCell>
                    <TableCell>{r.cm}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground leading-relaxed pt-2">
              {t("sizeGuideShoeDesc")}
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
