// app/(tabs)/_components/SpendingChart.tsx
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { ContributionGraph, PieChart } from "react-native-chart-kit";
import { useTransactions } from "../context/TransactionContext";

export default function SpendingChart() {
  const { state } = useTransactions();
  const screenWidth = Dimensions.get("window").width;

  // Transform transactions into daily spending data
  const dailyData = state.transactions
    .filter((t) => t.type === "expense")
    .map((t) => ({
      date: t.date.split("T")[0], // Format: YYYY-MM-DD
      count: Math.abs(t.amount),
    }));

  // Category breakdown data remains the same
  const categoryData = state.categories
    .filter((cat) => cat !== "Income")
    .map((category) => {
      const total = state.transactions
        .filter((t) => t.category === category && t.type === "expense")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return {
        name: `${category} ($${total.toFixed(0)})`,
        amount: total,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        legendFontColor: "#9CA3AF",
      };
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Spending Heatmap</Text>
      <ContributionGraph
        values={dailyData}
        endDate={new Date()}
        numDays={90}
        width={screenWidth - 60}
        height={220}
        tooltipDataAttrs={(value) => ({
          fill: `rgba(96, 165, 250, ${value.value})`,
          x: 0,
          y: 0,
        })}
        chartConfig={{
          backgroundColor: "#1E1E1E",
          backgroundGradientFrom: "#1E1E1E",
          backgroundGradientTo: "#1E1E1E",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(96, 165, 250, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
          style: {
            borderRadius: 12,
          },
        }}
        style={styles.chart}
      />

      <Text style={styles.title}>Spending by Category</Text>
      <PieChart
        data={categoryData}
        width={screenWidth - 60}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="#1E1E1E"
        paddingLeft="15"
        center={[10, 0]}
        absolute
      />
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
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
});
