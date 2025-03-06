import { useState, useEffect } from "react"

export function useFetchData<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error("Network response was not ok")
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}