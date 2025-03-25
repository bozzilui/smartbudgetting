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
      <Text style={styles.title}>Budget Tracking</Text>
      {state.categories
        .filter((category) => category !== "Income")
        .map((category) => {
          const spent = calculateSpending(category);
          const budget = state.budgets[category] || 1000; // Default budget
          const progress = budget > 0 ? spent / budget : 0;

          return (
            <View key={category} style={styles.budgetItem}>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.category}>{category}</Text>
                  <Text style={styles.amounts}>
                    ${spent.toFixed(2)} of ${budget.toFixed(2)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.percentage,
                    progress > 0.9 ? styles.danger : styles.safe,
                  ]}
                >
                  {Math.round(progress * 100)}%
                </Text>
              </View>
              <Progress.Bar
                progress={progress}
                width={null}
                height={6}
                color={progress > 0.9 ? "#EF4444" : "#10B981"}
                unfilledColor="#2D2D2D"
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
    padding: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  budgetItem: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  amounts: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  percentage: {
    fontSize: 16,
    fontWeight: "600",
  },
  safe: {
    color: "#10B981",
  },
  danger: {
    color: "#EF4444",
  },
});
