// app/transactions.tsx - Transactions screen
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AddTransactionForm from "../_components/AddTransactionForm";
import { Transaction, NewTransaction } from "./types/transaction";
import { TransactionFilters } from "../_components/TransactionFilters";
import { useTransactions } from "../context/TransactionContext";

interface FilterState {
  search: string;
  category: string;
  type: string;
}

export default function Transactions() {
  const { state, dispatch } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState(
    state.transactions
  );

  // Update filtered transactions when context state changes
  useEffect(() => {
    setFilteredTransactions(state.transactions);
  }, [state.transactions]);

  const handleFilterChange = (filters: FilterState) => {
    let result = [...state.transactions];

    if (filters.search) {
      result = result.filter((t) =>
        t.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category && filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }

    if (filters.type && filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }

    setFilteredTransactions(result);
  };

  const handleAddTransaction = (newTransaction: NewTransaction) => {
    dispatch({
      type: "ADD_TRANSACTION",
      payload: newTransaction,
    });
  };

  const totalIncome = filteredTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <View style={styles.container}>
      {/* Summary Header */}
      <View style={styles.header}>
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

      {/* Filters Toggle */}
      <TouchableOpacity
        style={styles.filterToggle}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Text style={styles.filterToggleText}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Text>
        <FontAwesome
          name={showFilters ? "chevron-up" : "chevron-down"}
          size={16}
          color="#666"
        />
      </TouchableOpacity>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <TransactionFilters onFilterChange={handleFilterChange} />
        </View>
      )}

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.transaction}>
            <View style={styles.transactionHeader}>
              <Text style={styles.description}>{item.description}</Text>
              <Text
                style={[
                  styles.amount,
                  item.amount > 0 ? styles.income : styles.expense,
                ]}
              >
                ${Math.abs(item.amount).toFixed(2)}
              </Text>
            </View>
            <View style={styles.transactionMeta}>
              <View style={styles.categoryContainer}>
                <FontAwesome name="tag" size={12} color="#666" />
                <Text style={styles.category}>{item.category}</Text>
              </View>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <FontAwesome name="money" size={48} color="#ddd" />
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubtext}>
              Add a transaction to get started
            </Text>
          </View>
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowForm(true)}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Add Transaction Modal */}
      {showForm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowForm(false)}
            >
              <FontAwesome name="times" size={24} color="#666" />
            </TouchableOpacity>
            <AddTransactionForm
              onSubmit={(transaction) => {
                handleAddTransaction(transaction);
                setShowForm(false);
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    marginHorizontal: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "600",
  },
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterToggleText: {
    marginRight: 8,
    color: "#666",
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listContainer: {
    padding: 16,
  },
  transaction: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3436",
  },
  transactionMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f2f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  category: {
    fontSize: 13,
    color: "#636e72",
    marginLeft: 4,
  },
  date: {
    fontSize: 13,
    color: "#b2bec3",
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
  },
  income: {
    color: "#00b894",
  },
  expense: {
    color: "#ff7675",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#00b894",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
  },
  modalClose: {
    alignSelf: "flex-end",
    padding: 8,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3436",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#636e72",
  },
});
