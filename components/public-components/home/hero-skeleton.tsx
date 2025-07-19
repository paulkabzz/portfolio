import styles from './index.module.css';

const HeroSkeleton = () => {
  return (
    <section className={styles.container}>
        <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
                <div className="absolute w-full h-full bg-gray-200 animate-pulse rounded-full" />
            </div>
        </div>
        <div className={styles.textSection}>
            <div className={styles.textContainer}>
                {/* Headline skeleton */}
                <div className="mb-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-1" />
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
                
                {/* Occupation skeleton */}
                <div className="mb-6">
                    <div className="h-7 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>
                
                {/* Buttons skeleton */}
                <div className={styles.buttons}>
                    <div className="h-12 bg-gray-200 rounded animate-pulse w-32" />
                    <div className="h-12 bg-gray-200 rounded animate-pulse w-32" />
                </div>
                
                {/* Social links skeleton */}
                <div className={styles.socials}>
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSkeleton;