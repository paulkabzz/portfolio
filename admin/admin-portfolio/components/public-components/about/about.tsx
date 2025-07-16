import { parseTextWithFormatting } from '@/components/utils';
import React from 'react'

interface IAbout {
  about: string;
}

const About: React.FC<IAbout> = ({ about }) => {

    return (
        <div className='w-full flex flex-col' id='about'>
            <h2 className='font-bold text-[2rem] text-center mb-5'>About</h2>
            <div className='px-[10%] flex flex-col gap-4'>
                {
                    about.split("\n").map((paragraph, index) => (
                        <p key={index} className='text-[14px]'>
                            {parseTextWithFormatting(paragraph)}
                        </p>
                    ))
                }
            </div>
        </div>
    );
};
export default About;