import Link from "next/link";
import katex from 'katex';
import 'katex/dist/katex.min.css';

export const parseTextWithFormatting = (text: string) => {
    // Recursive function to handle nested formatting
    const parseRecursive = (input: string): React.ReactNode[] => {
        // Split by all formatting markers: **, {{, }}, ~, links, and inline math $...$
        const parts = input.split(/(\*\*[^*]*\*\*|\{\{[^\}]*\}\}|~[^~]*~|\[\["[^"]*":\s*[^\]]*\]\]|\$[^$]+\$)/);
        
        return parts.map((part, index) => {
            // Check for inline math $...$
            if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
                const latex = part.slice(1, -1);
                try {
                    const html = katex.renderToString(latex, {
                        displayMode: false,
                        throwOnError: false,
                    });
                    return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
                } catch (e) {
                    return <span key={index} className="text-red-500">{latex}</span>;
                }
            }
            // Check for bold text **text**
            else if (part.startsWith('**') && part.endsWith('**')) {
                const content = part.slice(2, -2);
                return <b key={index}>{parseRecursive(content)}</b>;
            }
            // Check for green text {{text}}
            else if (part.startsWith('{{') && part.endsWith('}}')) {
                const content = part.slice(2, -2);
                return <span key={index} className="text-green">{parseRecursive(content)}</span>;
            }
            // Check for italic text ~text~
            else if (part.startsWith('~') && part.endsWith('~')) {
                const content = part.slice(1, -1);
                return <i key={index}>{parseRecursive(content)}</i>;
            }
            // Check for links [["url": text]]
            else if (part.startsWith('[["') && part.endsWith(']]')) {
                const linkContent = part.slice(2, -2); // Remove [[ and ]]
                const colonIndex = linkContent.indexOf('":');
                
                if (colonIndex !== -1) {
                    const url = linkContent.slice(1, colonIndex); // Remove opening quote
                    const text = linkContent.slice(colonIndex + 2).trim(); // Remove ": and trim
                    
                    return (
                        <Link
                            key={index} 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            {parseRecursive(text)}
                        </Link>
                    );
                }
                // If link format is invalid, return as plain text
                return part;
            }
            // Return regular text as is
            return part;
        });
    };
    
    return parseRecursive(text);
};