import React from "react";
import { View, TextInputProps } from "react-native";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Text as UIText } from "~/components/ui/text";

interface FormInputProps<T extends FieldValues>
  extends Omit<TextInputProps, "value" | "onChangeText"> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  required,
  error,
  helperText,
  ...inputProps
}: FormInputProps<T>) {
  return (
    <View className="gap-2">
      {label && (
        <UIText className="text-sm text-primary font-medium">
          {label}
          {required && " *"}
        </UIText>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, onBlur } }) => (
          <Input
            value={value || ""}
            onChangeText={onChange}
            onBlur={onBlur}
            className="bg-background border-border text-foreground"
            {...inputProps}
          />
        )}
      />
      {error && <UIText className="text-xs text-destructive">{error}</UIText>}
      {helperText && !error && (
        <UIText className="text-xs text-muted-foreground">{helperText}</UIText>
      )}
    </View>
  );
}
