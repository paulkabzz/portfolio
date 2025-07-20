import { PersonalInfo } from '@/app/dashboard/page'
import Link from 'next/link'
import React from 'react'

const Footer: React.FC<Partial<PersonalInfo>> = ({ name, surname, github }) => {
  return (
    <footer className='w-full bg-primary'>
        <p className="text-center text-secondary text-sm font-bold">Created By {github ? <Link href={github} className='text-blue-300 hover:underline'>{`${name} ${surname}`}</Link> : `${name} ${surname}`}. Released under the MIT License. </p>
    </footer>
  )
}

export default Footer