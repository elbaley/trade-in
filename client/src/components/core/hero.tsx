import { useTranslation } from "react-i18next";
import heroVideo from "../../assets/hero.mp4";
import { Button } from "../ui/button";
import { LucideArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GetOfferForm } from "../getOfferForm/GetOfferForm";
export const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="animate-slide-up max-sm:px-4 bgred-500 pt-14 flex justify-center flex-col items-center">
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
      <Dialog>
        <DialogTrigger>
          <Button variant={"action"} className="mt-2" size={"lg"}>
            {t("getStarted")}
            <LucideArrowRight />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-50 px-0 min-w-[80vw] min-h-[80vh] overflow-y-auto max-h-[95vh]">
          {/* <DialogHeader></DialogHeader> */}
          <GetOfferForm />
        </DialogContent>
      </Dialog>
    </section>
  );
};
