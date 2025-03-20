// app/(tabs)/_components/TransactionFilters.tsx
import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTransactions } from "../context/TransactionContext";

type FilterState = {
  search: string;
  category: string;
  type: string;
};

export function TransactionFilters({
  onFilterChange,
}: {
  onFilterChange: (filters: FilterState) => void;
}) {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
  });

  const { state } = useTransactions();

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search transactions..."
        value={filters.search}
        onChangeText={(text) => handleChange("search", text)}
      />
      <Picker
        selectedValue={filters.category}
        onValueChange={(value) => handleChange("category", value)}
      >
        <Picker.Item label="All Categories" value="all" />
        {state.categories.map((category) => (
          <Picker.Item key={category} label={category} value={category} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
});
