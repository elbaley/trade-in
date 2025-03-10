import { useState } from "react";

export type Selection = { questionId: number; optionId: number };
type Step = "company" | "model" | "condition" | "getOffer" | "acceptForm";

export const useGetOfferForm = () => {
  const [offerData, setOfferData] = useState<{
    offerId: number | null;
    companyId: number | null;
    modelId: number | null;
    selections: Selection[];
  }>({
    offerId: null,
    modelId: null,
    companyId: null,
    selections: [],
  });
  const [currentStep, setCurrentStep] = useState<Step>("company");
  const companyId = offerData.companyId;
  const modelId = offerData.modelId;
  const offerId = offerData.offerId;
  const selections = offerData.selections;

  const goToNextStep = () => {
    switch (currentStep) {
      case "company":
        return setCurrentStep("model");
      case "model":
        return setCurrentStep("condition");
      case "condition":
        return setCurrentStep("getOffer");
      case "getOffer":
        return setCurrentStep("acceptForm");
      default:
        return;
    }
  };
  const goToPreviousStep = () => {
    switch (currentStep) {
      case "model":
        return setCurrentStep("company");
      case "condition":
        return setCurrentStep("model");
      case "getOffer":
        return setCurrentStep("condition");
      case "acceptForm":
        return setCurrentStep("getOffer");
      default:
        return;
    }
  };

  const progressValue = (() => {
    switch (currentStep) {
      case "company":
        return 20;
      case "model":
        return 40;
      case "condition":
        return 60;
      case "getOffer":
        return 80;
      case "acceptForm":
        return 100;
      default:
        return 0;
    }
  })();

  const setModel = (modelId: number) => {
    setOfferData({ ...offerData, modelId });
  };

  const setCompany = (companyId: number) => {
    setOfferData({ ...offerData, companyId });
  };

  const setSelections = (selections: Selection[]) => {
    setOfferData({ ...offerData, selections });
  };

  const setOffer = (offerId: number) => {
    setOfferData({ ...offerData, offerId });
  };

  return {
    currentStep,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    setModel,
    setCompany,
    setSelections,
    setOffer,
    companyId,
    modelId,
    selections,
    progressValue,
    offerId,
  };
};
