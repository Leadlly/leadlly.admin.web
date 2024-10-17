import { userSidebarLinks } from "../../../helpers/constants";
import Sidebar from "./Sidebar";


const Dashboard = ({ meetingsLength }: { meetingsLength: number }) => {
  
  return (
    <Sidebar
    sidebar={userSidebarLinks}
    meetingsLength={meetingsLength}
  />
  );
};

export default Dashboard;


