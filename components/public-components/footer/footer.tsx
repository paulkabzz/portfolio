import { PersonalInfo } from '@/app/dashboard/page'
import React from 'react'

const Footer: React.FC<Partial<PersonalInfo>> = ({ name, surname }) => {
  return (
    <footer className='w-full bg-primary'>
        <p className="text-center text-secondary text-sm font-bold">Created By {`${name} ${surname}`}. Released under the MIT License. </p>
    </footer>
  )
}

export default Footer