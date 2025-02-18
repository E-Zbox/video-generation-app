"use client";
import React, { ChangeEvent } from "react";
import { Input, Label, MainTextInput } from "../styles/TextInput.styles";

interface IProps {
  disabled: boolean;
  label: string;
  name: string;
  min?: string;
  max?: string;
  type: string;
  value: string;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TextInput = (props: IProps) => {
  const {
    disabled,
    label,
    name,
    type,
    value,
    handleInputChange,
    ...inputProps
  } = props;
  return (
    <MainTextInput>
      <Label>{label}</Label>
      <Input
        disabled={disabled}
        name={name}
        type={type}
        value={value}
        onChange={handleInputChange}
        {...inputProps}
      />
    </MainTextInput>
  );
};

export default TextInput;
