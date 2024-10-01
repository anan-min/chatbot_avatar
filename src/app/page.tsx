import Navbar from "@/components/Navbar";
import AudioRecorder from "@/components/home/AudioRecorder";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="pt-14">
        <div className="p-6 flex justify-center">
          <AudioRecorder />
        </div>
      </main>
    </div>
  );
}
