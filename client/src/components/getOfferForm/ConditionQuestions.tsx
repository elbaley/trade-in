import { Spinner } from "../core/spinner";
import { ErrorAlert } from "../core/error-alert";
import { useTranslation } from "react-i18next";
import { Option } from "../core/option";
import { useModel } from "@/hooks/useModel";
import { useState } from "react";
import { Button } from "../ui/button";
import { LucideArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Selection } from "./useGetOfferForm";

type ConditionQuestionsProps = {
  modelId: number;
  onComplete: (selections: Selection[]) => void;
};
export const ConditionQuestions = ({
  modelId,
  onComplete,
}: ConditionQuestionsProps) => {
  const { t } = useTranslation();
  const { isLoading, data, isError } = useModel({ modelId });
  const model = data?.data;
  const [selections, setSelections] = useState<
    { questionId: number; optionId: number }[]
  >([]);

  return (
    <div className="animate-slide-left">
      <h1 className=" mb-4 flex items-center gap-x-2 text-2xl sm:text-3xl font-medium lg:mb-5">
        {t("answerConditionQuestions")}
      </h1>
      {isLoading ? <Spinner /> : null}
      {isError ? <ErrorAlert /> : null}

      {model &&
        model.questions.map((question, idx) => {
          return (
            <div key={question.id} className="mb-4">
              <div className="flex gap-2 py-2 items-center">
                <div
                  className={cn(
                    "bg-gray-500  bggreen-600 rounded-full w-6 h-6 flex justify-center",
                    selections.some((s) => s.questionId === question.id) &&
                      "bg-gray-900",
                  )}
                >
                  <span className="text-white font-light">{idx + 1}</span>
                </div>
                <h3 className="text-base">{question.question}</h3>
              </div>
              <div className="flex gap-3 flex-wrap">
                {question.options.map((option) => {
                  return (
                    <Option
                      key={option.id}
                      selected={selections.some(
                        (q) => q.optionId === option.id,
                      )}
                      label={option.label}
                      description={option.description}
                      onClick={() => {
                        setSelections((prev) => [
                          ...prev.filter((s) => s.questionId !== question.id),
                          {
                            questionId: question.id,
                            optionId: option.id,
                          },
                        ]);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      <Button
        onClick={() => onComplete(selections)}
        className="mt-4 max-w-96 w-full"
        size={"lg"}
        disabled={model?.questions.length !== selections.length}
      >
        {t("getOffer")}
        <LucideArrowRight />
      </Button>
    </div>
  );
};
