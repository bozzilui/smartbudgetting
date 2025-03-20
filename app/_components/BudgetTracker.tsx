// app/(tabs)/_components/BudgetTracker.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTransactions } from "../context/TransactionContext";
import * as Progress from "react-native-progress";

export default function BudgetTracker() {
  const { state } = useTransactions();

  const calculateSpending = (category: string) => {
    return state.transactions
      .filter((t) => t.category === category && t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budget Overview</Text>
      {state.categories
        .filter((category) => category !== "Income")
        .map((category) => {
          const spent = calculateSpending(category);
          const budget = state.budgets[category] || 1000; // Default budget
          const progress = budget > 0 ? spent / budget : 0;

          return (
            <View key={category} style={styles.budgetItem}>
              <View style={styles.headerRow}>
                <Text style={styles.category}>{category}</Text>
                <Text style={styles.amounts}>
                  ${spent.toFixed(2)} / ${budget.toFixed(2)}
                </Text>
              </View>
              <Progress.Bar
                progress={progress}
                width={null}
                height={10}
                color={progress > 0.9 ? "#ff4444" : "#00C851"}
                unfilledColor="#e0e0e0"
                borderWidth={0}
              />
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  budgetItem: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    fontWeight: "500",
  },
  amounts: {
    fontSize: 14,
    color: "#666",
  },
});
