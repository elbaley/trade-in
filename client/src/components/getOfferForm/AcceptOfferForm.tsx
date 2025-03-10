import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { ApiResponse } from "@/lib/apiTypes";
import { useState } from "react";
import { LucideCheck } from "lucide-react";
import { toast } from "sonner";

type AcceptOfferFormProps = {
  offerId: number;
};

const formSchema = z.object({
  firstName: z.string().nonempty({ message: "First name is required" }),
  lastName: z.string().nonempty({ message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .min(10)
    .nonempty({ message: "Phone number is required" }),
});

export const AcceptOfferForm = ({ offerId }: AcceptOfferFormProps) => {
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();
  const mutation = useMutation<
    ApiResponse,
    ApiResponse,
    z.infer<typeof formSchema>
  >({
    mutationFn: async (values) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tradeOffers/acceptOffer`,
        {
          method: "POST",
          body: JSON.stringify({ offerId, ...values }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.json();
    },
    onSuccess: (data) => {
      if (data.status) {
        setSuccess(true);
      } else {
        toast.error(t("genericError"));
      }
    },
    onError: () => {
      toast.error(t("genericError"));
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <>
      {!success ? (
        <>
          <h1 className=" mb-4 flex items-center gap-x-2 text-2xl sm:text-3xl font-medium lg:mb-5">
            {t("acceptOfferFormDescription")}
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("First Name")}</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder={t("Enter first name")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Last Name")}</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder={t("Enter last name")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Email")}</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder={t("Enter email")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Phone Number")}</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder={t("Enter phone number")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{t("Submit")}</Button>
            </form>
          </Form>
        </>
      ) : (
        <div className=" h-full animate-slide-left flex flex-col items-center justify-center pb-10">
          <div className="bg-green-500 flex justify-center items-center w-40 h-40 rounded-full">
            <LucideCheck className="text-white" size={64} />
          </div>
          <div className="pt-4 text-center">
            <span className="font-medium text-xl">
              {t("getOfferSuccessTitle")}
            </span>
            <p>{t("getOfferSuccessDescription")}</p>
          </div>
        </div>
      )}
    </>
  );
};
