import Navbar from "@/components/Navbar";
import MainCard from "@/components/home/MainCard";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="pt-14">
        <div className="p-6 flex justify-center">
          <MainCard />
        </div>
      </main>
    </div>
  );
}
