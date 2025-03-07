import Button from "./Buttton";
import Card from "./Card";
import Student_Portfolio from "./Student_Teacher";
import Title from "./title";

// here we can add all the components that we want to use in the dashboard (you can rename this file to whatever you want)]
export default async function Combined_component() {
  return (
    <div className="flex flex-col p-6 m-3">
      <div className="flex justify-between ml-2 mr-4">
        <Title title={"Institute Overview & Management"} />
        <Button />
      </div>
      <div className="flex flex-col justify-center">
        <Card />
        <Student_Portfolio />
        
      </div>
    </div>
  );
}
