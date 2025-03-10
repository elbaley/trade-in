import { useCompanies } from "@/hooks/useCompanies";
import { Spinner } from "../core/spinner";
import { ErrorAlert } from "../core/error-alert";
import { useTranslation } from "react-i18next";
import { Option } from "../core/option";

type SelectCompanyProps = {
  onSelectCompany: (companyId: number) => void;
};
export const SelectCompany = ({ onSelectCompany }: SelectCompanyProps) => {
  const { t } = useTranslation();
  const { isLoading, data, isError } = useCompanies();
  const companies = data?.data;

  return (
    <div className="animate-slide-left">
      <h1 className=" mb-4 flex items-center gap-x-2 text-2xl sm:text-3xl font-medium lg:mb-5">
        {t("selectBrand")}
      </h1>
      {isLoading ? <Spinner /> : null}
      {isError ? <ErrorAlert /> : null}

      {companies && (
        <div className="flex flex-col gap-4  justify-start">
          {companies.map((company) => (
            <Option
              key={company.id}
              label={company.name}
              onClick={() => {
                onSelectCompany(company.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
