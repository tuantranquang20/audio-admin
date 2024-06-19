import { useSearchParams } from "next/navigation";

export default function useSearchParamsCus() {
  const searchParams = useSearchParams();

  const paramsObj: any = {};
  searchParams.forEach((value, key) => {
    paramsObj[key] = value;
  });

  console.log(paramsObj);

  return { searchParams, paramsObj };
}
