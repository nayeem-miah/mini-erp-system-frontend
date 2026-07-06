"use client";

import React from "react";
import { Category } from "@/types";
import CustomSelect, { CustomSelectOption } from "../ui/CustomSelect";

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
}

export default function CategorySelect({ categories, value, onChange }: CategorySelectProps) {
  const options: CustomSelectOption[] = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <CustomSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Select a category"
      showSearch
      triggerClassName="rounded-md"
    />
  );
}
