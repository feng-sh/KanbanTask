import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * クラス名を結合するユーティリティ関数
 * clsxとtailwind-mergeを使用して、複数のクラス名を結合し、重複を解決します
 *
 * @param inputs - 結合するクラス名の配列
 * @returns 結合されたクラス名文字列
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};