// app/(tabs)/_components/AddTransactionForm.tsx
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTransactions } from "../context/TransactionContext";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
};

type AddTransactionFormProps = {
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
};

export default function AddTransactionForm({
  onSubmit,
}: AddTransactionFormProps) {
  const { state } = useTransactions();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState(state.categories[0]);

  const handleSubmit = () => {
    if (!description || !amount) return;

    onSubmit({
      description,
      amount: parseFloat(amount) * (type === "expense" ? -1 : 1),
      type,
      date: new Date().toISOString(),
      category,
    });

    // Reset form
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory(state.categories[0]);
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <View style={styles.typeSelector}>
        <Button
          title="Expense"
          onPress={() => setType("expense")}
          color={type === "expense" ? "#ff4444" : "#999"}
        />
        <Button
          title="Income"
          onPress={() => setType("income")}
          color={type === "income" ? "#00C851" : "#999"}
        />
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(value) => setCategory(value)}
          style={styles.picker}
        >
          {state.categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>
      <Button title="Add Transaction" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  typeSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginBottom: 12,
  },
  picker: {
    height: 50,
  },
});
