import {} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { LucideCheck, LucideGlobe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { LoginForm } from "../login-form";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, signOut, initials } = useAuth();
  const currentLang = i18n.resolvedLanguage;
  return (
    <header className="flex px-4 gap-2 z-40 items-center max-w-4xl h-16 bg-white shadow-custom  dark:bg-gray-700 rounded-2xl mx-auto mt-6 max-sm:mx-2">
      <div className="flex-1 ">
        <Link to="/" className="flex gap-2 items-center">
          <svg
            width="21"
            height="25"
            viewBox="0 0 21 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.289062 12.5273C0.289062 12.2773 0.378906 12.0586 0.558594 11.8711C0.738281 11.6836 0.949219 11.5898 1.19141 11.5898H10.5898L12.3477 11.6719L11.6562 11.0039L9.72266 9.19922C9.53516 9.03516 9.44141 8.82422 9.44141 8.56641C9.44141 8.32422 9.51562 8.12109 9.66406 7.95703C9.82031 7.79297 10.0195 7.71094 10.2617 7.71094C10.4883 7.71094 10.6953 7.80078 10.8828 7.98047L14.5977 11.8477C14.7227 11.9648 14.8047 12.0781 14.8438 12.1875C14.8906 12.2969 14.9141 12.4102 14.9141 12.5273C14.9141 12.6445 14.8906 12.7578 14.8438 12.8672C14.8047 12.9766 14.7227 13.0898 14.5977 13.207L10.8828 17.0742C10.6953 17.2539 10.4883 17.3438 10.2617 17.3438C10.0195 17.3438 9.82031 17.2656 9.66406 17.1094C9.51562 16.9531 9.44141 16.75 9.44141 16.5C9.44141 16.2344 9.53516 16.0195 9.72266 15.8555L11.6562 14.0508L12.3477 13.3828L10.5898 13.4531H1.19141C0.949219 13.4531 0.738281 13.3633 0.558594 13.1836C0.378906 12.9961 0.289062 12.7773 0.289062 12.5273ZM6.85156 15.6562V21.5859C6.85156 22.0547 6.98438 22.4141 7.25 22.6641C7.51562 22.9219 7.89844 23.0508 8.39844 23.0508H16.6016C17.0938 23.0508 17.4727 22.9219 17.7383 22.6641C18.0039 22.4141 18.1367 22.0547 18.1367 21.5859V3.48047C18.1367 3.01172 18.0039 2.65234 17.7383 2.40234C17.4727 2.14453 17.0938 2.01562 16.6016 2.01562H8.39844C7.89844 2.01562 7.51562 2.14453 7.25 2.40234C6.98438 2.65234 6.85156 3.01172 6.85156 3.48047V9.39844H4.96484V3.17578C4.96484 2.26172 5.25781 1.52734 5.84375 0.972656C6.42969 0.410156 7.19922 0.128906 8.15234 0.128906H16.8359C17.7891 0.128906 18.5586 0.410156 19.1445 0.972656C19.7305 1.52734 20.0234 2.26172 20.0234 3.17578V21.8906C20.0234 22.8047 19.7305 23.5391 19.1445 24.0938C18.5586 24.6562 17.7891 24.9375 16.8359 24.9375H8.15234C7.19922 24.9375 6.42969 24.6562 5.84375 24.0938C5.25781 23.5391 4.96484 22.8047 4.96484 21.8906V15.6562H6.85156Z"
              fill="black"
            />
          </svg>
          <span className="font-medium">{t("tradeIn")}</span>
        </Link>
      </div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Avatar>
              <AvatarFallback className="select-none">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{t("My Account")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to="/admin">
                <DropdownMenuItem>{t("Dashboard")}</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>{t("logout")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button>{t("header.login")}</Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-50 ">
            <DialogHeader>
              <DialogTitle>{t("Login")}</DialogTitle>
            </DialogHeader>
            <LoginForm />
          </DialogContent>
        </Dialog>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            <LucideGlobe />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuLabel>{t("header.language.label")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              i18n.changeLanguage("en");
            }}
          >
            {t("header.language.english")}
            {currentLang === "en" && <LucideCheck />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              i18n.changeLanguage("tr");
            }}
          >
            {t("header.language.turkish")}
            {currentLang === "tr" && <LucideCheck />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
