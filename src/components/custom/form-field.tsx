"use client";

import { HTMLInputTypeAttribute, ReactElement } from "react";
import { Control, ControllerRenderProps } from "react-hook-form";
import { PasswordInput } from "~/components/custom/password-input";
import {
  FormControl,
  FormDescription,
  FormField as FormFld,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

interface FormFieldProps {
  control: Control<any>;
  name: string;
  fieldType: HTMLInputTypeAttribute;
  label?: string;
  placeholder?: string;
  imgSrc?: string;
  imgSvg?: ReactElement;
  description?: string;
}

interface RenderInputProps {
  field: ControllerRenderProps<any, string>;
  type: HTMLInputTypeAttribute;
  placeholder?: string;
}

function RenderInput({ type, field, placeholder }: RenderInputProps) {
  switch (type) {
    case "password":
      return <PasswordInput placeholder={placeholder} {...field} />;

    default:
      return <Input type={type} placeholder={placeholder} {...field} />;
  }
}

export default function FormField(props: FormFieldProps) {
  const { control, name, fieldType, label, placeholder, description } = props;

  return (
    <FormFld
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RenderInput
              type={fieldType}
              placeholder={placeholder}
              field={field}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
