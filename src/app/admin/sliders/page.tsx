import { getAllSliders } from "@/services/sliderService";
import { SliderManager } from "./SliderManager";

export const metadata = {
  title: "Sliders | ShopFlow Admin",
};

export default async function SlidersPage() {
  const sliders =
    await getAllSliders();

  return (
    <SliderManager
      sliders={sliders}
    />
  );
}