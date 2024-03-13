import { Card } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
  logo: ReactNode;
  title: string;
  totalNumber: number;
};

const AdminCards: React.FC<Props> = (props: Props) => {
  const { logo, title, totalNumber } = props;

  return (
    <div className='justify-center items-center'>
      <Card style={{ height: "5rem" }} className='flex justify-center items-center m-5' hoverable>
        <div className='flex flex-row justify-between items-center' style={{width: "14rem"}}>
          <div className='bg-orange-200 rounded-full flex justify-center items-center w-10 h-10'>
            {logo}
          </div>
          <div className='flex flex-col justify-center'>
            <span className='text-right font-sans font-bold text-2xl'>{totalNumber}</span>
            <span>{title}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminCards;
