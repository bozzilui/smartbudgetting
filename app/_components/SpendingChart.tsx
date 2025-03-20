// app/(tabs)/_components/SpendingChart.tsx
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { useTransactions } from "../context/TransactionContext";

export default function SpendingChart() {
  const { state } = useTransactions();
  const screenWidth = Dimensions.get("window").width;

  // Monthly spending data
  const monthlyData = state.transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString("default", { month: "short" });
    if (t.type === "expense") {
      acc[month] = (acc[month] || 0) + Math.abs(t.amount);
    }
    return acc;
  }, {} as Record<string, number>);

  // Category breakdown data
  const categoryData = state.categories
    .filter((cat) => cat !== "Income")
    .map((category) => {
      const total = state.transactions
        .filter((t) => t.category === category && t.type === "expense")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return {
        name: category,
        amount: total,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Spending</Text>
      <LineChart
        data={{
          labels: Object.keys(monthlyData),
          datasets: [
            {
              data: Object.values(monthlyData),
            },
          ],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        }}
        style={styles.chart}
      />

      <Text style={styles.title}>Spending by Category</Text>
      <PieChart
        data={categoryData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
