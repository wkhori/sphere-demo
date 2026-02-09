"use client";

import * as React from "react";
import { Account } from "@/lib/types";

type AccountsContextValue = {
  onSelectAccount?: (account: Account) => void;
  onViewDetails: (account: Account) => void;
};

export const AccountsContext = React.createContext<AccountsContextValue>({
  onViewDetails: () => {},
});

export function useAccountsContext() {
  return React.useContext(AccountsContext);
}
