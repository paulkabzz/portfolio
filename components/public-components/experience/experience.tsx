import { useExperience } from "@/app/context/experience-context";
import type { Experience } from "@/app/context/experience-context";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Building, Calendar, ExternalLink, MapPin, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ExperienceSkeletonCard = () => (
    <CardContent className="">
        <div className="border border-[#ddd] rounded-lg p-4 space-y-3">
            {/* Image Skeleton */}
            <div className="w-full h-[350px] bg-gray-200 rounded animate-pulse">
                <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded"></div>
            </div>

            <div className="space-y-2">
                {/* Company info skeleton */}
                <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-300" />
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                
                {/* Location skeleton */}
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-300" />
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                
                {/* Date skeleton */}
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-300" />
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                </div>
            </div>
            
            {/* Title skeleton */}
            <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
            
            {/* Description skeleton */}
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
            
            {/* Skills skeleton */}
            <div className="flex flex-wrap gap-1">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                ))}
            </div>
        </div>
    </CardContent>
);

const Experience = () => {
    const { experiences, loading } = useExperience();
    const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({});
    const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});
    const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

    const nextImage = (experienceIndex: number, totalImages: number) => {
        const newIndex = ((currentImageIndex[experienceIndex] || 0) + 1) % totalImages;
        const imageKey = `${experienceIndex}-${newIndex}`;
        
        // Set loading state for the new image
        setImageLoading(prev => ({ ...prev, [imageKey]: true }));
        
        setCurrentImageIndex(prev => ({
            ...prev,
            [experienceIndex]: newIndex
        }));
    };

    const prevImage = (experienceIndex: number, totalImages: number) => {
        const newIndex = ((currentImageIndex[experienceIndex] || 0) - 1 + totalImages) % totalImages;
        const imageKey = `${experienceIndex}-${newIndex}`;
        
        // Set loading state for the new image
        setImageLoading(prev => ({ ...prev, [imageKey]: true }));
        
        setCurrentImageIndex(prev => ({
            ...prev,
            [experienceIndex]: newIndex
        }));
    };

    const handleImageLoad = (experienceIndex: number, imageIndex: number) => {
        const imageKey = `${experienceIndex}-${imageIndex}`;
        setImageLoading(prev => ({ ...prev, [imageKey]: false }));
    };

    const handleImageError = (experienceIndex: number, imageIndex: number) => {
        const imageKey = `${experienceIndex}-${imageIndex}`;
        setImageLoading(prev => ({ ...prev, [imageKey]: false }));
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

    const isImageLoading = (experienceIndex: number, imageIndex: number) => {
        const imageKey = `${experienceIndex}-${imageIndex}`;
        return imageLoading[imageKey] || false;
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

                {/* Loading state */}
                {loading && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                            <ExperienceSkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {/* Loaded experiences */}
                {!loading && experiences.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {experiences.map((experience, index: number) => {
                            const currentIndex = currentImageIndex[index] || 0;
                            const isCurrentImageLoading = isImageLoading(index, currentIndex);
                            
                            return (
                                <CardContent key={index} className="">
                                    {/* min-h-[580px] */}
                                    <div className="border border-[#ddd] rounded-lg p-4 space-y-3">
                                        {/* Image Carousel */}
                                        <div className="relative">
                                            {/* Loading skeleton */}
                                            {isCurrentImageLoading && (
                                                <div className="absolute inset-0 bg-gray-200 rounded z-10 animate-pulse">
                                                    <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded"></div>
                                                </div>
                                            )}
                                            
                                            <img
                                                src={experience.images[currentIndex]}
                                                alt="Preview"
                                                className={`w-full object-cover rounded max-h-[350px] transition-opacity duration-200 ${
                                                    isCurrentImageLoading ? 'opacity-0' : 'opacity-100'
                                                }`}
                                                onLoad={() => handleImageLoad(index, currentIndex)}
                                                onError={() => handleImageError(index, currentIndex)}
                                            />
                                            
                                            {/* Navigation arrows - only show if more than 1 image */}
                                            {experience.images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={() => prevImage(index, experience.images.length)}
                                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors z-20"
                                                        disabled={isCurrentImageLoading}
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => nextImage(index, experience.images.length)}
                                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors z-20"
                                                        disabled={isCurrentImageLoading}
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </button>
                                                    
                                                    {/* Image indicators */}
                                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20">
                                                        {experience.images.map((_, imgIndex) => (
                                                            <button
                                                                key={imgIndex}
                                                                onClick={() => {
                                                                    const imageKey = `${index}-${imgIndex}`;
                                                                    setImageLoading(prev => ({ ...prev, [imageKey]: true }));
                                                                    setCurrentImageIndex(prev => ({ ...prev, [index]: imgIndex }));
                                                                }}
                                                                disabled={isCurrentImageLoading}
                                                                className={`w-2 h-2 rounded-full transition-colors ${
                                                                    currentIndex === imgIndex 
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
                            );
                        })}
                    </div>
                )}

                {/* Empty state - when not loading and no experiences */}
                {!loading && experiences.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No experiences found.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Experience;