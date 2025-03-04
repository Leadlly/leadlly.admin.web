import Button from "./Buttton";
import Card from "./Card";
import Student_Portfolio from "./Student";
import Title from "./title";

// here we can add all the components that we want to use in the dashboard (you can rename this file to whatever you want)]
export default async function Combined_component() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between m-2 pl-10 pr-10">
        <Title />
        <Button />
      </div>
      <div className="flex flex-col justify-center">
        <Card />
        <Student_Portfolio />
      </div>
    </div>
  );
}
