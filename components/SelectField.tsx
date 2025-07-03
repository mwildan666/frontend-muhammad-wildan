"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

type SelectFieldProps<T> = {
  fetcher: () => Promise<T[]>;
  valueField: keyof T;
  labelField: keyof T;
  onChange: (value: T | null) => void;
  placeholder?: string;
  autoSelectFirst?: boolean;
};

export default function SelectField<T>({
  fetcher,
  valueField,
  labelField,
  onChange,
  placeholder,
  autoSelectFirst = false,
}: SelectFieldProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    setLoading(true);

    fetcher().then((res) => {
      if (!mounted) return;

      setData(res);

      if (autoSelectFirst && res.length > 0) {
        const first = res[0];
        setSelectedValue(String(first[valueField]));
        onChange(first);
      } else if (res.length === 0) {
        // reset value jika tidak ada data
        setSelectedValue("");
        onChange(null);
      }
    });

    setLoading(false);

    return () => {
      mounted = false;
    };
  }, [fetcher]);

  return (
    <Select
      value={selectedValue}
      onValueChange={(val) => {
        const selected = data.find((item) => String(item[valueField]) === val);
        if (selected) {
          setSelectedValue(val);
          onChange(selected);
        }
      }}
    >
      <SelectTrigger
        className="
          w-full
          border-gray-300
          shadow-sm
          focus:ring-2 focus:ring-primary focus:border-primary
          transition-all duration-300
        "
      >
        <SelectValue placeholder={placeholder || "Pilih..."} />
      </SelectTrigger>
      <SelectContent
        className="
          animate-in fade-in slide-in-from-top-1 duration-200
        "
      >
        {loading ? (
          <SelectItem value="loading" disabled>
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Loading...
            </div>
          </SelectItem>
        ) : data.length === 0 ? (
          <div className="px-4 py-2 text-gray-500 text-sm text-center select-none">
            No Data Found
          </div>
        ) : (
          data.map((item, idx) => (
            <SelectItem
              key={idx}
              value={String(item[valueField])}
              className="hover:bg-primary/10 focus:bg-primary/20 transition-colors"
            >
              {`${item[valueField]} - ${item[labelField]}`}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
