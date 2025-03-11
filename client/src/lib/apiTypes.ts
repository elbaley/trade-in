export type CompaniesGetResponse = {
  status: boolean;
  data: {
    id: number;
    name: string;
    logoUrl: string | null;
  }[];
};

export type ModelsGetResponse = {
  status: boolean;
  data: {
    id: number;
    name: string;
    companyId: number;
    maxTradeValue: number;
    imageUrl: string | null;
  }[];
};

export type ModelGetResponse = {
  status: boolean;
  data: {
    questions: {
      id: number;
      question: string;
      options: {
        id: number;
        label: string;
        description: string;
        deduction: number;
      }[];
    }[];
    companyId: number;
    id: number;
    name: string;
    maxTradeValue: number;
    imageUrl: string | null;
  };
};

export type GetOfferResponse = {
  status: boolean;
  data: {
    offerId: number;
    offerPrice: number;
  };
};

export type ApiResponse = {
  status: boolean;
  message?: string;
};

export type StatsResponse = {
  status: boolean;
  data: {
    totalCompanies: number;
    totalModels: number;
    totalTradeOffers: number;
    pendingTradeOffers: number;
  };
};

export type TradeOffersGetResponse = {
  status: boolean;
  data: {
    id: number;
    status: "done" | "draft" | "pending" | "accepted" | "rejected";
    modelId: number;
    modelName: string;
    selections: string;
    offerPrice: number;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    createdAt: string;
  }[];
};
