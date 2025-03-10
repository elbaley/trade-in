import { LucideArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { SelectCompany } from "./SelectCompany";
import { SelectModel } from "./SelectModel";
import { useGetOfferForm } from "./useGetOfferForm";
import { useTranslation } from "react-i18next";
import { ConditionQuestions } from "./ConditionQuestions";
import { Offer } from "./Offer";
import { AcceptOfferForm } from "./AcceptOfferForm";

export const GetOfferForm = () => {
  const { t } = useTranslation();
  const {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    setModel,
    setCompany,
    setSelections,
    setOffer,
    companyId,
    modelId,
    progressValue,
    selections,
    offerId,
  } = useGetOfferForm();

  return (
    <div className="animate-slide-up  rounded-xl p-8 lg:p-10 pt-0 lg:pt-0 max-h-screen h-full ">
      <div className="flex items-center h-16 relative">
        {currentStep !== "company" && currentStep !== "acceptForm" && (
          <Button
            onClick={goToPreviousStep}
            className="animate-slide-up shrink-0 absolute left-0"
            variant={"ghost"}
          >
            <LucideArrowLeft />
          </Button>
        )}

        <h1 className="flex-1 select-none text-lg text-center font-medium">
          {t("getOffer")}
        </h1>
      </div>
      {currentStep !== "acceptForm" && (
        <Progress value={progressValue} className="mb-4" />
      )}
      {currentStep === "company" ? (
        <SelectCompany
          onSelectCompany={(companyId) => {
            setCompany(companyId);
            goToNextStep();
          }}
        />
      ) : null}
      {currentStep === "model" ? (
        <SelectModel
          companyId={companyId}
          onSelectModel={(modelId) => {
            setModel(modelId);
            goToNextStep();
          }}
        />
      ) : null}
      {currentStep === "condition" && modelId ? (
        <ConditionQuestions
          modelId={modelId}
          onComplete={(selections) => {
            setSelections(selections);
            goToNextStep();
          }}
        />
      ) : null}
      {currentStep === "getOffer" && modelId ? (
        <Offer
          modelId={modelId}
          selections={selections}
          onAccept={(offerId) => {
            setOffer(offerId);
            goToNextStep();
          }}
        />
      ) : null}
      {currentStep === "acceptForm" && offerId ? (
        <AcceptOfferForm offerId={offerId} />
      ) : null}
    </div>
  );
};
