import { parseTextWithFormatting } from "@/components/utils"
import type React from "react"

interface IAbout {
  about: string
  img: string;
}

const About: React.FC<IAbout> = ({ about, img }) => {
  return (
    <section className="w-full py-0 lg:py-24 bg-gradient-to-br from-white to-gray-50" id="about">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-2xl lg:text-2xl font-bold text-[#131313] mb-0">About Me</h2>
          <div className="w-24 h-1 bg-[#059669] mx-auto rounded-full"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Section */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={img}
                alt="About me"
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#131313]/20 to-transparent"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#059669] rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#ddd] rounded-full opacity-30"></div>
          </div>

          {/* Text Content */}
          <div className="space-y-8">
            {about
              .split("\n")
            //   .filter((paragraph) => paragraph.trim())
              .map((paragraph, index) => (
                <div
                  key={index}
                  className="text-[#131313]/80 leading-relaxed text-[12px]"
                  >
                    { parseTextWithFormatting(paragraph) }
                </div>
              ))}

              </div>
        </div>
      </div>
    </section>
  )
}

export default About
