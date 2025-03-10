import { Spinner } from "../core/spinner";
import { ErrorAlert } from "../core/error-alert";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { LucideArrowRight } from "lucide-react";
import { Selection } from "./useGetOfferForm";
import { useOffer } from "@/hooks/useOffer";

type OfferProps = {
  modelId: number;
  selections: Selection[];
  onAccept: (offerId: number) => void;
};
export const Offer = ({ modelId, selections, onAccept }: OfferProps) => {
  const { t } = useTranslation();
  const { isLoading, data, isError } = useOffer({ modelId, selections });
  const offer = data?.data;

  return (
    <div className="animate-slide-left">
      {isLoading ? <Spinner /> : null}
      {isError ? <ErrorAlert /> : null}
      {offer && (
        <>
          <h1 className=" mb-4 flex items-center gap-x-2 text-2xl sm:text-3xl font-medium lg:mb-5">
            {t("offerText", {
              price: new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: "TRY",
              }).format(offer.offerPrice),
            })}
          </h1>
          <Button
            onClick={() => {
              if (!offer?.offerId) return;
              onAccept(offer.offerId);
            }}
            className="mt-4 max-w-96 w-full"
            size={"lg"}
          >
            {t("continue")}
            <LucideArrowRight />
          </Button>
        </>
      )}
    </div>
  );
};
