import { useExperience } from "@/app/context/experience-context";
import type { Experience } from "@/app/context/experience-context";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Building, Calendar, ExternalLink, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Experience = () => {
    const { experiences, loading } = useExperience();
    const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({});
    const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});

    const nextImage = (experienceIndex: number, totalImages: number) => {
        setCurrentImageIndex(prev => ({
            ...prev,
            [experienceIndex]: ((prev[experienceIndex] || 0) + 1) % totalImages
        }));
    };

    const prevImage = (experienceIndex: number, totalImages: number) => {
        setCurrentImageIndex(prev => ({
            ...prev,
            [experienceIndex]: ((prev[experienceIndex] || 0) - 1 + totalImages) % totalImages
        }));
    };

    const toggleDescription = (experienceIndex: number) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [experienceIndex]: !prev[experienceIndex]
        }));
    };

    const isDescriptionLong = (description: string) => {
        // Check if description would be more than 1 line (roughly 65 characters)
        return description && description.length > 80;
    };

    const getTruncatedDescription = (description: string) => {
        if (!description) return "Experience description will appear here...";
        return description.length > 65 ? description.substring(0, 65) + "..." : description;
    };

    console.log(experiences);

    return (
        <section className="w-full py-0 lg:py-24 bg-white" id="experience">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-2xl lg:text-2xl font-bold text-[#131313] mb-0">Experience</h2>
                    <div className="w-24 h-1 bg-[#059669] mx-auto rounded-full"></div>
                </div>

                {experiences.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {experiences.map((experience, index: number) => (
                            <CardContent key={index} className="">
                                {/* min-h-[580px] */}
                                <div className=" border border-[#ddd] rounded-lg p-4 space-y-3">
                                    {/* Image Carousel */}
                                    <div className="relative">
                                        <img
                                            src={experience.images[currentImageIndex[index] || 0]}
                                            alt="Preview"
                                            className="w-full object-cover rounded max-h-[350px]"
                                        />
                                        
                                        {/* Navigation arrows - only show if more than 1 image */}
                                        {experience.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => prevImage(index, experience.images.length)}
                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => nextImage(index, experience.images.length)}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                                
                                                {/* Image indicators */}
                                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                                    {experience.images.map((_, imgIndex) => (
                                                        <button
                                                            key={imgIndex}
                                                            onClick={() => setCurrentImageIndex(prev => ({ ...prev, [index]: imgIndex }))}
                                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                                (currentImageIndex[index] || 0) === imgIndex 
                                                                    ? 'bg-white' 
                                                                    : 'bg-white/50'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Building className="h-4 w-4 text-primary/60" />
                                            {
                                                experience.company_url ? (
                                                    <Link href={experience.company_url} target="_blank" className="text-sm text-[#2571fe] hover:underline">
                                                        {experience.company || "Company Name"}
                                                        {experience.company_url && (
                                                            <ExternalLink className="h-3 w-3 ml-1 inline" />
                                                        )}
                                                    </Link>
                                                ) : (
                                            <span className="text-sm text-primary/60">
                                                {experience.company || "Company Name"}
                                            </span>
                                                )
                                            }
                                        </div>
                                        {experience.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-primary/60" />
                                                <span className="text-sm text-primary/60">{experience.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-primary/60" />
                                            <span className="text-sm text-primary/60">
                                                {experience.startDate ? new Date(experience.startDate).toLocaleDateString() : "Start date"} - 
                                                {experience.current ? " Present" : 
                                                experience.endDate ? ` ${new Date(experience.endDate).toLocaleDateString()}` : " End date"}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <h3 className="font-semibold text-primary">{experience.title || "Job Title"}</h3>
                                    
                                    {/* Description with Read More functionality */}
                                    <div className="text-sm text-primary/70">
                                        {expandedDescriptions[index] || !isDescriptionLong(experience.description) 
                                            ? (experience.description || "Experience description will appear here...")
                                            : getTruncatedDescription(experience.description)
                                        }
                                        {isDescriptionLong(experience.description) && (
                                            <button
                                                onClick={() => toggleDescription(index)}
                                                className="text-green hover:text-green/80 font-medium ml-1 transition-colors cursor-pointer"
                                            >
                                                {expandedDescriptions[index] ? "Read less" : "Read more"}
                                            </button>
                                        )}
                                    </div>
                                    
                                    {experience.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {experience.skills.slice(0, 3).map((skill) => (
                                                <Badge key={skill} variant="secondary" className="bg-secondary text-primary text-xs">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {experience.skills.length > 3 && (
                                                <Badge variant="secondary" className="bg-secondary text-primary text-xs">
                                                    +{experience.skills.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Experience;