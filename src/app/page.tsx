import Navbar from "@/components/Navbar";
import Maincard from "@/components/home/MainCard";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <div className="p-6 flex justify-center">
          <Maincard />
        </div>
      </main>
    </div>
  );
}
