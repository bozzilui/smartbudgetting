// app/context/TransactionContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Transaction, NewTransaction } from "../(tabs)/types/transaction";

import { db, auth } from "../_auth/firebase";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

interface TransactionState {
  userId: string | null;
  transactions: Transaction[];
  categories: string[];
  budgets: { [key: string]: number };
}

type TransactionAction =
  | { type: "ADD_TRANSACTION"; payload: NewTransaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "ADD_CATEGORY"; payload: string }
  | { type: "SET_BUDGET"; payload: { category: string; amount: number } }
  | { type: "LOAD_TRANSACTIONS"; payload: Transaction[] };

const initialState: TransactionState = {
  userId: null,
  transactions: [],
  categories: ["Food", "Transport", "Entertainment", "Bills", "Income"],
  budgets: {},
};

const TransactionContext = createContext<{
  state: TransactionState;
  dispatch: React.Dispatch<TransactionAction>;
}>({ state: initialState, dispatch: () => null });

function transactionReducer(
  state: TransactionState,
  action: TransactionAction
): TransactionState {
  switch (action.type) {
    case "ADD_TRANSACTION":
      // Save to Firestore
      const newTransaction = { ...action.payload, id: Date.now().toString() };
      addDoc(collection(db, "transactions"), {
        ...newTransaction,
        userId: auth.currentUser?.uid,
      });
      return {
        ...state,
        transactions: [newTransaction, ...state.transactions],
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case "SET_BUDGET":
      return {
        ...state,
        budgets: {
          ...state.budgets,
          [action.payload.category]: action.payload.amount,
        },
      };
    case "LOAD_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload,
      };
    default:
      return state;
  }
}

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Load transactions when user changes
  useEffect(() => {
    const loadTransactions = async () => {
      if (auth.currentUser) {
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", auth.currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const transactions = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Transaction[];

        dispatch({ type: "LOAD_TRANSACTIONS", payload: transactions });
      }
    };

    loadTransactions();
  }, [auth.currentUser]);

  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);
