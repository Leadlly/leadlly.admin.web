const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthsOfYear = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function getTodaysDay() {
  const today = new Date();
  const dayOfWeek = daysOfWeek[today.getDay()];

  return `${dayOfWeek}`;
}

export function getMonthDate(date: Date): string {
  const dayOfMonth: string = String(date.getDate()).padStart(2, "0");
  const month: string = monthsOfYear[date.getMonth()];

  return `${month} ${dayOfMonth}`;
}

export function getTodaysFormattedDate() {
  const today = new Date();
  const dayOfMonth = String(today.getDate()).padStart(2, "0");
  const month = monthsOfYear[today.getMonth()];
  const year = today.getFullYear();

  return `${dayOfMonth} ${month} ${year}`;
}

export function getFormattedDate(date: Date): string {
  const dayOfMonth: string = String(date.getDate()).padStart(2, "0");
  const month: string = monthsOfYear[date.getMonth()];
  const year: number = date.getFullYear();

  return `${dayOfMonth} ${month} ${year}`;
}

export function convertDateString(inputDate: Date): string {
  const utcDate = new Date(inputDate);

  // Convert to IST by adding 5 hours and 30 minutes
  const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

  // Format the date
  const day = istDate.getDate().toString().padStart(2, "0");
  const month = (istDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const year = istDate.getFullYear();

  // Format the date as DD-MM-YYYY
  return `${day}-${month}-${year}`;
}

export function formatDate(dateString: Date): string {

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  return `${day} ${month}`;
}

export function capitalizeFirstLetter(sentence: string): string {
  if (!sentence) {
    return sentence;
  }

  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}
