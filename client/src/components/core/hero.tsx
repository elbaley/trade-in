import { useTranslation } from "react-i18next";
import heroVideo from "../../assets/hero.mp4";
import { Button } from "../ui/button";
import { LucideArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
export const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="max-sm:px-4 bgred-500 pt-14 flex justify-center flex-col items-center">
      <video
        src={heroVideo}
        width="430"
        height="388"
        autoPlay
        loop
        x-webkit-airplay="deny"
        title="Animation showing two phones transferring data."
      ></video>
      <h1 className="text-7xl font-extrabold">{t("tradeIn")}</h1>
      <p className="pt-2 text-secondary text-lg sm:text-xl max-w-lg text-center">
        {t("heroDescription")}
      </p>
      <Link to="/admin">
        <Button variant={"action"} className="mt-2" size={"lg"}>
          {t("getStarted")}
          <LucideArrowRight />
        </Button>
      </Link>
    </section>
  );
};
