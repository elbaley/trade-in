import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
//@ts-expect-error: i18n is not a module
import tF from "../../i18n.js";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import { useModel } from "@/hooks/useModel";

type OptionType = {
  id?: number;
  label_tr: string;
  label_en: string;
  description_tr: string;
  description_en: string;
  deduction: string;
};

export function TradeQuestionsManager({ modelId }: { modelId: number }) {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useModel({ modelId });
  const modelDetail = data?.data;
  const [questionTr, setQuestionTr] = useState("");
  const [questionEn, setQuestionEn] = useState("");
  const [options, setOptions] = useState<OptionType[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null,
  );

  const addOption = () => {
    setOptions([
      ...options,
      {
        label_tr: "",
        label_en: "",
        description_tr: "",
        description_en: "",
        deduction: "",
      },
    ]);
  };

  const updateOption = (
    index: number,
    field: keyof OptionType,
    value: string,
  ) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const createQuestionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/modelTradeQuestions/${modelId}`,
        {
          method: "POST",
          body: JSON.stringify({ tr: questionTr, en: questionEn }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      return response.json();
    },
    onSuccess: async (res) => {
      const questionId = res.data[0].id;
      await Promise.all(
        options.map((opt) =>
          fetch(
            `${import.meta.env.VITE_API_URL}/modelTradeOptions/${questionId}`,
            {
              method: "POST",
              body: JSON.stringify({
                label_tr: opt.label_tr,
                label_en: opt.label_en,
                description_tr: opt.description_tr,
                description_en: opt.description_en,
                deduction: Number(opt.deduction),
              }),
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            },
          ).then((res) => res.json()),
        ),
      );
      toast.success("Question and options created successfully");
      queryClient.invalidateQueries({
        queryKey: ["model", modelId, i18n.language],
      });
      setQuestionTr("");
      setQuestionEn("");
      setOptions([]);
      setEditingQuestionId(null);
    },
    onError: () => toast.error("Failed to create question"),
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/modelTradeQuestions/${editingQuestionId}`,
        {
          method: "PUT",
          body: JSON.stringify({ tr: questionTr, en: questionEn }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      return response.json();
    },
    onSuccess: async (res) => {
      const questionId = res.data.id;
      // For each option, update if it has an id, otherwise create new
      await Promise.all(
        options.map((opt) => {
          if (opt.id) {
            return fetch(
              `${import.meta.env.VITE_API_URL}/modelTradeOptions/${opt.id}`,
              {
                method: "PUT",
                body: JSON.stringify({
                  label_tr: opt.label_tr,
                  label_en: opt.label_en,
                  description_tr: opt.description_tr,
                  description_en: opt.description_en,
                  deduction: Number(opt.deduction),
                }),
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              },
            ).then((res) => res.json());
          } else {
            return fetch(
              `${import.meta.env.VITE_API_URL}/modelTradeOptions/${questionId}`,
              {
                method: "POST",
                body: JSON.stringify({
                  label_tr: opt.label_tr,
                  label_en: opt.label_en,
                  description_tr: opt.description_tr,
                  description_en: opt.description_en,
                  deduction: Number(opt.deduction),
                }),
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              },
            ).then((res) => res.json());
          }
        }),
      );
      toast.success("Question and options updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["model", modelId, i18n.language],
      });
      setQuestionTr("");
      setQuestionEn("");
      setOptions([]);
      setEditingQuestionId(null);
    },
    onError: () => toast.error("Failed to update question"),
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId: number) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/modelTradeQuestions/${questionId}`,
        { method: "DELETE", credentials: "include" },
      );
      return response.json();
    },
    onSuccess: () => {
      toast.success("Question deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["model", modelId, i18n.language],
      });
    },
    onError: () => toast.error("Failed to delete question"),
  });

  const handleSubmit = () => {
    const isValid = options.some(
      (opt) =>
        opt.label_tr.trim() &&
        opt.label_en.trim() &&
        opt.description_tr.trim() &&
        opt.description_en.trim() &&
        opt.deduction.trim(),
    );
    if (!isValid) {
      toast.error("Please fill at least one option completely.");
      return;
    }
    if (editingQuestionId) {
      updateQuestionMutation.mutate();
    } else {
      createQuestionMutation.mutate();
    }
  };

  if (isLoading) return <div>Loading model details...</div>;
  if (isError) return <div>Error loading model details.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">{tF.t("Trade Questions")}</h2>

      {modelDetail &&
      modelDetail.questions &&
      modelDetail.questions.length > 0 ? (
        modelDetail.questions.map((q) => (
          <Collapsible key={q.id} className="mb-2 border rounded">
            <div className="flex justify-between items-center p-2">
              <CollapsibleTrigger className="font-medium">
                {q.question}
              </CollapsibleTrigger>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingQuestionId(q.id);
                    setQuestionTr(q.question);
                    setQuestionEn(q.question);
                    setOptions(
                      q.options.map((opt) => ({
                        id: opt.id,
                        label_tr: opt.label_tr,
                        label_en: opt.label_en,
                        description_tr: opt.description_tr,
                        description_en: opt.description_en,
                        deduction: opt.deduction.toString(),
                      })),
                    );
                  }}
                >
                  ✏️
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to delete this question?" + q.id,
                      )
                    ) {
                      deleteQuestionMutation.mutate(q.id);
                    }
                  }}
                >
                  🗑️
                </Button>
              </div>
            </div>
            <CollapsibleContent className="p-2">
              {q.options && q.options.length > 0 ? (
                <ul className="space-y-1">
                  {q.options.map((opt) => (
                    <li key={opt.id} className="border-b pb-1">
                      <div>
                        <strong>{tF.t("Label")}:</strong> {opt.label}
                      </div>
                      <div>
                        <strong>{tF.t("Description")}:</strong>{" "}
                        {opt.description}
                      </div>
                      <div>
                        <strong>{tF.t("Deduction")}:</strong> {opt.deduction}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>{tF.t("No options")}</div>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))
      ) : (
        <div>{tF.t("No trade questions found")}</div>
      )}

      {/* Yeni soru ve seçenekler ekleme / düzenleme formu */}
      <div className="mt-6 border p-4 rounded">
        <h3 className="text-xl font-medium mb-2">
          {editingQuestionId
            ? tF.t("Edit Trade Question")
            : tF.t("Add New Trade Question")}
        </h3>
        <div className="flex flex-col gap-2">
          <Input
            value={questionTr}
            onChange={(e) => setQuestionTr(e.target.value)}
            placeholder={tF.t("Question (TR)")}
          />
          <Input
            value={questionEn}
            onChange={(e) => setQuestionEn(e.target.value)}
            placeholder={tF.t("Question (EN)")}
          />
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">{tF.t("Options")}</h4>
          {options.map((opt, idx) => (
            <div key={idx} className="border p-2 mb-2 rounded">
              <Input
                value={opt.label_tr}
                onChange={(e) => updateOption(idx, "label_tr", e.target.value)}
                placeholder={tF.t("Option Label (TR)")}
                className="mb-1"
              />
              <Input
                value={opt.label_en}
                onChange={(e) => updateOption(idx, "label_en", e.target.value)}
                placeholder={tF.t("Option Label (EN)")}
                className="mb-1"
              />
              <Input
                value={opt.description_tr}
                onChange={(e) =>
                  updateOption(idx, "description_tr", e.target.value)
                }
                placeholder={tF.t("Option Description (TR)")}
                className="mb-1"
              />
              <Input
                value={opt.description_en}
                onChange={(e) =>
                  updateOption(idx, "description_en", e.target.value)
                }
                placeholder={tF.t("Option Description (EN)")}
                className="mb-1"
              />
              <Input
                value={opt.deduction}
                onChange={(e) => updateOption(idx, "deduction", e.target.value)}
                placeholder={tF.t("Deduction")}
              />
            </div>
          ))}
          <Button onClick={addOption} className="mb-4">
            {tF.t("Add Option")}
          </Button>
        </div>

        <Button onClick={handleSubmit}>
          {editingQuestionId ? tF.t("Update") : tF.t("Submit")}
        </Button>
      </div>
    </div>
  );
}
