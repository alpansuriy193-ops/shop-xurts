import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const values = [
    { titleKey: "aboutValueCraftTitle", descKey: "aboutValueCraftDesc", number: "01" },
    { titleKey: "aboutValueSustainTitle", descKey: "aboutValueSustainDesc", number: "02" },
    { titleKey: "aboutValueSlowTitle", descKey: "aboutValueSlowDesc", number: "03" },
  ];

  return (
    <Layout>
      {/* Hero — Full Viewport */}
      <section ref={heroRef} className="relative h-[80vh] md:h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroImageY }}>
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80"
            alt="Curated boutique interior"
            className="w-full h-[120%] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-charcoal/10 to-charcoal/50" />
        </motion.div>

        <div className="relative container-full h-full flex flex-col justify-end pb-20 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/60 mb-5">
              {t("aboutOurStory")}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.9]">
              {t("aboutHeroTitle1")}
              <br />
              <span className="italic font-normal">{t("aboutHeroTitleItalic")}</span>
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-lg leading-relaxed">
              {t("aboutHeroDesc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-28 md:py-40">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="divider-ornament mb-12">
              <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary whitespace-nowrap">
                {t("aboutPhilosophyLabel")}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-[1.25] tracking-tight">
              {t("aboutPhilosophyText1")}
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Story — Large Image + Text */}
      <section className="pb-20 md:pb-32">
        <div className="container-full">
          {/* First story block */}
          <div className="grid md:grid-cols-12 gap-12 lg:gap-20 items-center mb-24 md:mb-36">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:col-span-5"
            >
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-5">
                {t("aboutBeginningLabel")}
              </p>
              <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-8 leading-tight">
                {t("aboutBeginningTitle1")}
                <br />
                <span className="italic">{t("aboutBeginningTitleItalic")}</span>
              </h3>
              <p className="text-muted-foreground leading-[1.8] mb-5">
                {t("aboutBeginningPara1")}
              </p>
              <p className="text-muted-foreground leading-[1.8]">
                {t("aboutBeginningPara2")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="md:col-span-7 relative"
            >
              <div className="aspect-[4/5] overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80"
                  alt="Curated boutique display"
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
              </div>
            </motion.div>
          </div>

          {/* Full-width banner image */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-24 md:mb-36"
          >
            <div className="relative h-[50vh] md:h-[70vh] overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
                alt="Retail atmosphere"
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="font-serif text-3xl md:text-5xl lg:text-6xl text-white text-center max-w-3xl px-6 leading-tight"
                >
                  {t("aboutQuoteLine1")}
                  <br />
                  <span className="italic">{t("aboutQuoteItalic")}</span>
                  <br />
                  {t("aboutQuoteLine2")}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Second story block — reversed */}
          <div className="grid md:grid-cols-12 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="md:col-span-7 md:order-first"
            >
              <div className="aspect-[4/5] overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80"
                  alt="Artisan workshop"
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="md:col-span-5"
            >
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-5">
                {t("aboutApproachLabel")}
              </p>
              <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-8 leading-tight">
                {t("aboutApproachTitle1")}
                <br />
                <span className="italic">{t("aboutApproachTitleItalic")}</span>
              </h3>
              <p className="text-muted-foreground leading-[1.8] mb-5">
                {t("aboutApproachPara1")}
              </p>
              <p className="text-muted-foreground leading-[1.8]">
                {t("aboutApproachPara2")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-36 bg-linen">
        <div className="container-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
              {t("aboutValuesLabel")}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">
              {t("aboutValuesTitle")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-16 md:gap-12 lg:gap-20">
            {values.map((value, i) => (
              <motion.div
                key={value.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="text-center"
              >
                <span className="text-[11px] font-semibold tracking-[0.3em] text-primary/50 mb-4 block">
                  {value.number}
                </span>
                <h3 className="font-serif text-2xl text-foreground mb-5">
                  {t(value.titleKey)}
                </h3>
                <div className="w-8 h-px bg-primary/30 mx-auto mb-5" />
                <p className="text-muted-foreground leading-[1.8]">
                  {t(value.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Three-image strip */}
      <section className="py-4 md:py-6">
        <div className="grid grid-cols-3 gap-2 md:gap-4 h-[35vh] md:h-[50vh]">
          {[
            {
              src: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
              alt: "Signature parfum",
            },
            {
              src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
              alt: "Sneaker close-up",
            },
            {
              src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
              alt: "Wireless headphones",
            },
          ].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="overflow-hidden group"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/60" />
        </div>

        <div className="relative container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/50 mb-5">
              {t("aboutCtaLabel")}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
              {t("aboutCtaTitle")}
            </h2>
            <p className="text-white/60 mb-10 max-w-md mx-auto leading-relaxed">
              {t("aboutCtaDesc")}
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-none px-12 py-6 text-sm tracking-[0.15em] uppercase bg-white text-charcoal hover:bg-white/90"
            >
              <a href="mailto:hello@maison.com">
                {t("aboutCtaButton")}
                <ArrowRight className="ml-3 w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
