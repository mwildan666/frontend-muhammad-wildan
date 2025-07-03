"use client";

import { useState, useEffect, useCallback } from "react";
import { getNegaras, getPelabuhans, getBarangs } from "@/lib/api";
import SelectField from "@/components/SelectField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CountUp from "react-countup";

function formatRupiah(num: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
}

export default function Form() {
  const [negara, setNegara] = useState<any>(null);
  const [pelabuhan, setPelabuhan] = useState<any>(null);
  const [barang, setBarang] = useState<any>(null);
  const [total, setTotal] = useState<number>(0);
  const [diskonEdit, setDiskonEdit] = useState<number | "">("");

  useEffect(() => {
    if (barang) {
      setDiskonEdit(barang.diskon ?? 0);
    } else {
      setDiskonEdit("");
    }
  }, [barang]);

  useEffect(() => {
    if (barang) {
      const harga = Number(barang.harga || 0);
      const diskon = Number(diskonEdit) || 0;
      const totalHitung = harga - (harga * diskon) / 100;
      setTotal(totalHitung);
    } else {
      setTotal(0);
    }
  }, [barang, diskonEdit]);

  const fetchPelabuhans = useCallback(() => {
    if (!negara) return Promise.resolve([]);
    return getPelabuhans(negara.id_negara);
  }, [negara]);

  const fetchBarangs = useCallback(() => {
    if (!pelabuhan) return Promise.resolve([]);
    return getBarangs(pelabuhan.id_pelabuhan);
  }, [pelabuhan]);

  return (
    <div
      className="
        max-w-xl mx-auto mt-10
        bg-white/60
        backdrop-blur-sm
        shadow-2xl
        rounded-xl
        p-8
        space-y-6
        border border-gray-200
      "
    >
      <h1 className="text-2xl font-bold text-center text-primary">
        Form Barang
      </h1>

      <div className="space-y-3">
        <Label className="text-lg font-semibold">NEGARA</Label>
        <SelectField
          fetcher={getNegaras}
          valueField="id_negara"
          labelField="nama_negara"
          autoSelectFirst
          placeholder="Pilih Negara"
          onChange={setNegara}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-lg font-semibold">PELABUHAN</Label>
        <SelectField
          fetcher={fetchPelabuhans}
          valueField="id_pelabuhan"
          labelField="nama_pelabuhan"
          autoSelectFirst
          placeholder="Pilih Pelabuhan"
          onChange={setPelabuhan}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-lg font-semibold">BARANG</Label>
        <SelectField
          fetcher={fetchBarangs}
          valueField="id_barang"
          labelField="nama_barang"
          autoSelectFirst
          placeholder="Pilih Barang"
          onChange={setBarang}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-lg font-semibold">Deskripsi Barang</Label>
        <Textarea
          value={barang?.deskripsi || "-"}
          readOnly
          className="h-24 border-gray-300 focus:ring-primary focus:border-primary transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-lg font-semibold">DISKON (%)</Label>
          <Input
            value={diskonEdit}
            onChange={(e) =>
              setDiskonEdit(
                e.target.value === ""
                  ? ""
                  : Math.max(0, Math.min(100, Number(e.target.value)))
              )
            }
            type="number"
            min={0}
            max={100}
            placeholder="0"
            className="border-gray-300 focus:ring-primary focus:border-primary transition-all"
            disabled={!barang}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-lg font-semibold">HARGA</Label>
          <Input
            value={barang ? formatRupiah(Number(barang.harga)) : "-"}
            readOnly
            className="border-gray-300 focus:ring-primary focus:border-primary text-green-700 font-bold transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-lg font-bold">TOTAL</Label>
        <div className="text-green-800 text-3xl font-extrabold">
          {barang ? (
            <CountUp end={total} duration={1.2} separator="." prefix="Rp " />
          ) : (
            ":("
          )}
        </div>
      </div>
    </div>
  );
}
