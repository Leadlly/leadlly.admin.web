import { BatchGroup } from "@/types/batch";
import FilterBatches from "./_components/FilterBatches";
import StandardCard from "./_components/StandardCard";
import Head from "next/head";

async function getBatches(): Promise<BatchGroup[]> {
  const res = await fetch("http://localhost:3000/api/batches", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch batch data");
  }

  return res.json();
}

const BatchesPage = async () => {
  const batches = await getBatches();

  return (
    <>
      <Head>
        <title>Student Batches - Institute Name</title>
        <meta
          name="description"
          content="Explore detailed information about student batches at Institute. Find out about different standards and group details."
        />
        <link rel="canonical" href="http://localhost:3000/batches" />
      </Head>
      <main className="p-6 space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Student Batches of Institute
        </h1>

        <FilterBatches />
        {batches.map((bg) => (
          <StandardCard
            key={bg.standard} // Ensure each child in the list has a unique key
            standard={bg.standard}
            batches={bg.batch}
          />
        ))}
      </main>
    </>
  );
};

export default BatchesPage;
