// app/index.tsx - Dashboard screen
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTransactions } from "../context/TransactionContext";
import BudgetTracker from "../_components/BudgetTracker";
import SpendingChart from "../_components/SpendingChart";

export default function Dashboard() {
  const { state } = useTransactions();

  const totalIncome = state.transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={[styles.summaryAmount, styles.income]}>
            ${totalIncome.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={[styles.summaryAmount, styles.expense]}>
            ${totalExpenses.toFixed(2)}
          </Text>
        </View>
      </View>
      <BudgetTracker />
      <SpendingChart />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  income: {
    color: "#00C851",
  },
  expense: {
    color: "#ff4444",
  },
});
