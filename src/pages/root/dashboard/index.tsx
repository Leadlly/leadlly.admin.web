import React, { Suspense } from 'react';
import { Header } from '../../../components';
import Loader from '../Loader';

const Dashboard: React.FC = () => {
  return (
    <div className="relative h-full flex flex-col justify-start gap-3 xl:gap-6">
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <Header  />
      </div>
     
    </div>
    <div className="flex-1 flex items-start gap-4 lg:overflow-y-auto custom__scrollbar pr-2">
       
    <section className="h-full flex flex-col justify-start gap-4 py-2 xl:w-[calc(100%-268px)]">
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="relative border rounded-xl flex flex-col justify-start overflow-hidden h-[233px]">
              <Suspense fallback={<Loader />}>
                {/* {<TodaysPlan  />} */}
              </Suspense>
            </div>

           
          </div>

         
        </section>
        </div>
    </div>

  );
};

export default Dashboard;
